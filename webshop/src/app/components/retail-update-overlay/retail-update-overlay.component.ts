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
import { Router } from '@angular/router';

export interface UpdatedRetailListing {
    image_url: string;
    name: string;
    description: string;
    price: number;
    additional_properties: {
      [key: string]: string | number | boolean;
    };
    condition: string;
    delivery_method: string;
    status: string;
  }
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
    productId!: number;
    constructor(
        private fb: FormBuilder,
        private RetailsService: RetailsService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.productId = this.listing.product_id;
        Promise.all([
        this.loadRetailConditions(),
        this.loadRetailDeliveryMethods(),
        this.loadRetailStatus(),
        this.loadListing(),
        ])
           // Initialize the form using FormBuilder
           this.retailForm = this.fb.group({
            image_url: [
                this.listing?.image_url || '',
                [Validators.required, Validators.pattern('(http|https)://.+')],
              ],
              name: [this.listing?.name || '', Validators.required],
              description: [this.listing?.description || ''],
              price: [
                this.listing?.price || null,
                [Validators.required, Validators.min(0)],
              ],
            additional_properties: this.fb.array([]),
            delivery_method_name: [this.listing?.delivery_method_name || '', Validators.required],
            condition_name: [this.listing?.condition_name || '', Validators.required],
        status_name: [this.listing?.status_name || '', Validators.required],
          });

        
    }

    async loadListing(): Promise<void> {
        return new Promise((resolve, reject) => {
          this.RetailsService.getListingById(this.productId).subscribe({
            next: (listing) => {
                this.listing = Array.isArray(listing) && listing.length > 0 ? listing[0] : null;

if (this.listing && this.listing.product_id) {
    this.productId = this.listing.product_id;
    console.log("product_id", this.productId);
} else {
    console.error("product_id is undefined or listing does not have product_id");
}

              const updatedListing: UpdatedRetailListing = {
                image_url: this.retailForm.get('image_url')?.value,
                name: this.retailForm.get('name')?.value,
                description: this.retailForm.get('description')?.value,
                price: this.retailForm.get('price')?.value,
                condition: this.retailForm.get('condition_name')?.value,
                delivery_method: this.retailForm.get('delivery_method_name')?.value,
                status: this.retailForm.get('status_name')?.value,
                additional_properties: this.mapBackAdditionalProperties()
            };
              // Populate the form once the listing is fetched
              this.RetailsService.updateListing(
                this.listing.product_id, updatedListing
              );
              resolve();
            },
            error: (error) => {
              console.error('Error fetching listing:', error);
              reject(error);
            },
          });
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
            const updatedListing: UpdatedRetailListing = {
                image_url: this.retailForm.get('image_url')?.value,
                name: this.retailForm.get('name')?.value,
                description: this.retailForm.get('description')?.value,
                price: this.retailForm.get('price')?.value,
                condition: this.retailForm.get('condition_name')?.value,
                delivery_method: this.retailForm.get('delivery_method_name')?.value,
                status: this.retailForm.get('status_name')?.value,
                additional_properties: this.mapBackAdditionalProperties()
            };
            console.log('Updated listing:', updatedListing);
            
            console.log("product_id", this.productId);
            this.RetailsService
                .updateListing(this.productId, updatedListing)
                .subscribe({
                    next: () => {
                        alert('Listing updated successfully!');
                        this.listing = { ...this.listing, ...updatedListing };
                        this.update.emit(this.listing);
                        this.close.emit();
                        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                            this.router.navigate(['/own-products']);
                        });
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
