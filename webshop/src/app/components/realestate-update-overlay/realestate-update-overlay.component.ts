import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    Validators,
    FormsModule,
    ReactiveFormsModule,
    AbstractControl,
    ValidationErrors
} from '@angular/forms';
import {
    RealEstateListing,
    RealestateService
} from '../../services/realestate.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-realestate-update-overlay',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './realestate-update-overlay.component.html',
    styleUrls: ['./realestate-update-overlay.component.css']
})
export class RealestateUpdateOverlayComponent implements OnInit {
    @Input() listing!: RealEstateListing;
    @Output() close = new EventEmitter<void>();
    @Output() update = new EventEmitter<RealEstateListing>();

    realestateForm!: FormGroup;
    realEstateTypes: { type_id: number; type_name: string }[] = [];

    constructor(
        private fb: FormBuilder,
        private realestateService: RealestateService
    ) {}

    ngOnInit(): void {
        const formattedRentStart = this.formatDate(this.listing.rent_start);
        const formattedRentEnd = this.formatDate(this.listing.rent_end);

        this.loadRealEstateTypes();

        this.realestateForm = this.fb.group(
            {
                image_url: [
                    this.listing.image_url,
                    [Validators.required, Validators.pattern('https?://.+')]
                ],
                name: [this.listing.name, Validators.required],
                description: [this.listing.description],
                price: [
                    this.listing.price,
                    [Validators.required, Validators.min(1)]
                ],
                address: [this.listing.address, Validators.required],
                city: [this.listing.city, Validators.required],
                province: [this.listing.province, Validators.required],
                advance_payment: [
                    this.listing.advance_payment,
                    [Validators.min(0)]
                ],
                rent_start: [
                    formattedRentStart,
                    [
                        Validators.required,
                        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
                    ]
                ],
                rent_end: [
                    formattedRentEnd,
                    [
                        Validators.required,
                        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
                    ]
                ],
                type_name: [this.listing.type_name, Validators.required],
                additional_properties: this.fb.array(
                    this.mapAdditionalProperties()
                )
            },
            { validators: this.dateRangeValidator }
        );
    }

    private formatDate(date: string | Date | null): string | null {
        if (!date) {
            return null;
        }
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            '0'
        )}-${String(d.getDate()).padStart(2, '0')}`;
    }

    get additionalProperties(): FormArray {
        return this.realestateForm.get('additional_properties') as FormArray;
    }

    private mapAdditionalProperties(): FormGroup[] {
        return Object.entries(this.listing.additional_properties || {}).map(
            ([key, value]) =>
                this.fb.group({
                    key: [key, Validators.required],
                    value: [value, Validators.required]
                })
        );
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
        if (this.realestateForm.valid) {
            const updatedListing: RealEstateListing = {
                ...this.listing,
                ...this.realestateForm.value,
                additional_properties: this.mapBackAdditionalProperties()
            };

            this.realestateService
                .updateListing(this.listing.product_id, updatedListing)
                .subscribe({
                    next: (response) => {
                        alert('Listing updated successfully!');
                        this.update.emit(updatedListing);
                        this.close.emit();
                    },
                    error: (error) => {
                        alert(
                            'Failed to update the listing. Please try again.'
                        );
                    }
                });
        } else {
            this.markAllTouched(this.realestateForm);
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

    loadRealEstateTypes(): void {
        this.realestateService.getRealestateTypes().subscribe({
            next: (data) => {
                this.realEstateTypes = data;
            },
            error: (error) => {
                console.error('Error loading real estate types:', error);
            }
        });
    }

    private dateRangeValidator(
        control: AbstractControl
    ): ValidationErrors | null {
        const start = control.get('rent_start')?.value;
        const end = control.get('rent_end')?.value;

        return start && end && new Date(start) > new Date(end)
            ? { dateRangeInvalid: true }
            : null;
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
