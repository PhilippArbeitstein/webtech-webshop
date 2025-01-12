import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    Validators,
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import {
    RetailListing,
    RetailsService
} from '../../services/retail.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-retail-update-overlay',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './retail-update-overlay.component.html',
    styleUrls: ['./retail-update-overlay.component.css']
})
export class RetailUpdateOverlayComponent implements OnInit {
    @Input() listing!: RetailListing;
    @Output() close = new EventEmitter<void>();
    @Output() update = new EventEmitter<RetailListing>();

    retailForm!: FormGroup;
    retailConditions: {  condition_id: number; condition_name: string}[] = [];
    retailDeliveryMethods: {  delivery_method_id: number; delivery_method_name: string }[] = [];
    retailStatus: {  status_id: number; status_name: string }[] = [];

    constructor(
        private fb: FormBuilder,
        private RetailsService: RetailsService
    ) {}

    ngOnInit(): void {
        this.loadRetailConditions();
        this.loadRetailDeliveryMethods();
        this.loadRetailStatus();

           // Initialize the form using FormBuilder
           this.retailForm = this.fb.group({
            image_url: [
              '',
              [Validators.required, Validators.pattern('(http|https)://.+')],
            ],
            name: ['', Validators.required],
            description: [''],
            price: [null, [Validators.required, Validators.min(0)]],
            additional_properties: this.fb.array([]),
            condition: ['', Validators.required],
            delivery_method: ['', Validators.required],
            status: ['', Validators.required],
          });
        
    }

    get additionalProperties(): FormArray {
        return this.retailForm.get('additional_properties') as FormArray;
    }

    addProperty(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.additionalProperties.push(
            this.fb.group({
                key: ['', Validators.required],
                value: ['', Validators.required]
            })
        );
    }

    removeProperty(index: number, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.additionalProperties.removeAt(index);
    }

    onSubmit(): void {
        if (this.retailForm.valid) {
            const updatedListing: RetailListing = {
                ...this.listing,
                ...this.retailForm.value,
                additional_properties: this.mapBackAdditionalProperties()
            };

            this.RetailsService
                .updateListing(this.listing.product_id, updatedListing)
                .subscribe({
                    next: () => {
                        alert('Listing updated successfully!');
                        this.update.emit(updatedListing);
                        this.close.emit();
                    },
                    error: (e) => {
                        console.log(e)
                        alert(
                            'Failed to update the listing. Please try again.'
                        );
                    }
                });
        } else {
            this.markAllTouched(this.retailForm);
            alert('Please fill all required fields before submitting.');
        }
    }

    mapBackAdditionalProperties(): { [key: string]: string | number } {
        return this.additionalProperties.controls.reduce(
            (acc, control) => ({
                ...acc,
                [control.get('key')?.value]: control.get('value')?.value
            }),
            {}
        );
    }

    onClose(event: MouseEvent): void {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.close.emit();
    }

    cancelAll(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        if (target.hasAttribute('data-submit')) {
            event.stopPropagation();
            return;
        }

        event.stopPropagation();
        event.preventDefault();
    }

    loadRetailConditions(): void {
        this.RetailsService.getRetailConditions().subscribe({
          next: (data) => {
            this.retailConditions = data;
          },
          error: (error) => {
            console.error('Error loading retail Conditions:', error);
          },
        });
      }
      loadRetailDeliveryMethods(): void {
        this.RetailsService.getRetailDeliveryMethods().subscribe({
          next: (data) => {
            this.retailDeliveryMethods = data;
          },
          error: (error) => {
            console.error('Error loading retail delivery methods:', error);
          },
        });
      }
  loadRetailStatus(): void {
    this.RetailsService.getRetailStatuses().subscribe({
        next: (data) => {
            this.retailStatus = data;
        },
        error: (error) => {
            console.error('Error loading retail conditions:', error);
        }
    });
}
    private markAllTouched(group: FormGroup | FormArray): void {
        Object.values(group.controls).forEach((control) => {
            if (control instanceof FormGroup || control instanceof FormArray) {
                this.markAllTouched(control);
            } else {
                control.markAsTouched();
            }
        });
    }
}
