import { Component, EventEmitter, Output } from '@angular/core';
import { RetailsService } from '../../services/retail.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface NewRetailListing {
  image_url: string;
  name: string;
  description: string;
  price: number;
  additional_properties: {
    [key: string]: string | number | boolean;
  };
  mark_name: string;
  model_name: string;
  type_name: string;
  first_registration: Date;
  mileage: number;
  fuel_type: string;
  color: string;
  condition: string;
}

@Component({
  selector: 'app-retail-create-overlay',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './retail-create-overlay.component.html',
  styleUrls: ['./retail-create-overlay.component.css'],
})
export class RetailCreateOverlayComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  RetailForm: FormGroup;
  RetailTypes: { type_id: number; type_name: string }[] = [];
  RetailConditions: { condition_id: number; condition_name: string }[] = [];
  constructor(
    private fb: FormBuilder,
    private RetailsService: RetailsService
  ) {
    // Initialize the form using FormBuilder
    this.RetailForm = this.fb.group({
      image_url: [
        '',
        [Validators.required, Validators.pattern('(http|https)://.+')],
      ],
      name: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      additional_properties: this.fb.array([]),
      condition: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.loadretailConditions();
  }

  loadretailConditions(): void {
    this.RetailsService.getRetailConditions().subscribe({
      next: (data) => {
        this.RetailConditions = data;
      },
      error: (error) => {
        console.error('Error loading retail Conditions:', error);
      },
    });
  }

  get additionalProperties(): FormArray {
    return this.RetailForm.get('additional_properties') as FormArray;
  }

  addProperty(): void {
    const propertyGroup = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    });
    this.additionalProperties.push(propertyGroup);
  }

  removeProperty(index: number): void {
    this.additionalProperties.removeAt(index);
  }

  onCreate(): void {
    if (this.RetailForm.invalid) {
      this.markFormGroupTouched(this.RetailForm);
      return;
    }

    const additionalPropsArray = this.RetailForm.get(
      'additional_properties'
    )?.value;
    const additionalPropsObj: { [key: string]: string } = {};
    additionalPropsArray.forEach((item: any) => {
      if (item.key && item.value) {
        additionalPropsObj[item.key] = item.value;
      }
    });

    const newListing: NewRetailListing = {
      ...this.RetailForm.value,
      status: 'Available',
      additional_properties: additionalPropsObj,
      // rent_start: new Date(this.realestateForm.get('rent_start')?.value),
      // rent_end: new Date(this.realestateForm.get('rent_end')?.value)
    };

    this.RetailsService.createListing(newListing).subscribe({
      next: (response) => {
        alert(response);
        this.created.emit();
        this.onClose();
      },
      error: (error) => {
        console.error('Error creating listing:', error);
        alert('Eintrag konnte nicht erstellt werden. Versuche es erneut.');
      },
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
