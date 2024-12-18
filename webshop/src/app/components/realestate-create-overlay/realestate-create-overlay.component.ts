import { Component, EventEmitter, Output } from '@angular/core';
import { RealestateService } from '../../services/realestate.service';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface NewRealEstateListing {
    image_url: string;
    name: string;
    description: string;
    price: number;
    status_name: string;
    additional_properties: {
        [key: string]: string | number | boolean;
    };
    city: string;
    address: string;
    province: string;
    type_name: string;
    address_details: string;
    advance_payment: number;
    rent_start: Date;
    rent_end: Date;
}

@Component({
    selector: 'app-realestate-create-overlay',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './realestate-create-overlay.component.html',
    styleUrls: ['./realestate-create-overlay.component.css']
})
export class RealestateCreateOverlayComponent {
    @Output() close = new EventEmitter<void>();
    @Output() created = new EventEmitter<void>();

    realestateForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private realestateService: RealestateService
    ) {
        // Initialize the form using FormBuilder
        this.realestateForm = this.fb.group({
            image_url: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: [null, [Validators.required, Validators.min(0)]],
            status_name: ['', Validators.required],
            additional_properties: this.fb.array([]),
            city: ['', Validators.required],
            address: ['', Validators.required],
            province: ['', Validators.required],
            type_name: ['', Validators.required],
            address_details: ['', Validators.required],
            advance_payment: [null, [Validators.required, Validators.min(0)]],
            rent_start: ['', Validators.required],
            rent_end: ['', Validators.required]
        });
    }

    get additionalProperties(): FormArray {
        return this.realestateForm.get('additional_properties') as FormArray;
    }

    addProperty(): void {
        this.additionalProperties.push(
            this.fb.group({
                key: [''],
                value: ['']
            })
        );
    }

    removeProperty(index: number): void {
        this.additionalProperties.removeAt(index);
    }

    onCreate(): void {
        console.log(this.realestateForm.value);
        if (this.realestateForm.invalid) {
            this.markFormGroupTouched(this.realestateForm);
            return;
        }

        const newListing: NewRealEstateListing = {
            ...this.realestateForm.value,
            additional_properties: {
                ...this.realestateForm.get('additional_properties')?.value
            },
            rent_start: new Date(this.realestateForm.get('rent_start')?.value),
            rent_end: new Date(this.realestateForm.get('rent_end')?.value)
        };

        this.realestateService.createListing(newListing).subscribe({
            next: () => {
                alert('Real estate listing created successfully!');
                this.created.emit();
                this.onClose();
            },
            error: (err) => {
                console.error('Error creating listing:', err);
            }
        });
    }

    onClose(): void {
        this.close.emit();
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.values(formGroup.controls).forEach((control) => {
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            } else {
                control.markAsTouched();
            }
        });
    }
}
