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
            image_url: [
                '',
                [Validators.required, Validators.pattern('(http|https)://.+')]
            ],
            name: ['', Validators.required],
            description: [''],
            price: [null, [Validators.required, Validators.min(0)]],
            additional_properties: this.fb.array([]),
            city: ['', Validators.required],
            address: ['', Validators.required],
            province: ['', Validators.required],
            type_name: ['', Validators.required],
            address_details: [''],
            advance_payment: [null, [Validators.min(0)]],
            rent_start: ['', Validators.required],
            rent_end: ['', Validators.required]
        });
    }

    get additionalProperties(): FormArray {
        return this.realestateForm.get('additional_properties') as FormArray;
    }

    addProperty(): void {
        const propertyGroup = this.fb.group({
            key: ['', Validators.required],
            value: ['', Validators.required]
        });
        this.additionalProperties.push(propertyGroup);
    }

    removeProperty(index: number): void {
        this.additionalProperties.removeAt(index);
    }

    onCreate(): void {
        console.log(this.realestateForm);
        if (this.realestateForm.invalid) {
            this.markFormGroupTouched(this.realestateForm);
            return;
        }

        const additionalPropsArray = this.realestateForm.get(
            'additional_properties'
        )?.value;
        const additionalPropsObj: { [key: string]: string } = {};
        additionalPropsArray.forEach((item: any) => {
            if (item.key && item.value) {
                additionalPropsObj[item.key] = item.value;
            }
        });

        const newListing: NewRealEstateListing = {
            ...this.realestateForm.value,
            status_name: 'Available',
            additional_properties: additionalPropsObj,
            rent_start: new Date(this.realestateForm.get('rent_start')?.value),
            rent_end: new Date(this.realestateForm.get('rent_end')?.value)
        };

        console.log('New Listing:', newListing);

        // Close the form or proceed with the API submission
        this.onClose();
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
