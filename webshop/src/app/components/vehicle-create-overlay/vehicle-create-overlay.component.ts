import { Component, EventEmitter, Output } from '@angular/core';
import { VehiclesService } from '../../services/vehicles.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface NewVehicleListing {
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
  selector: 'app-vehicle-create-overlay',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-create-overlay.component.html',
  styleUrls: ['./vehicle-create-overlay.component.css'],
})
export class VehicleCreateOverlayComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  vehicleForm: FormGroup;
  vehicleTypes: { type_id: number; type_name: string }[] = [];
  vehicleMarks: { mark_id: number; mark_name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehiclesService
  ) {
    // Initialize the form using FormBuilder
    this.vehicleForm = this.fb.group({
      image_url: [
        '',
        [Validators.required, Validators.pattern('(http|https)://.+')],
      ],
      name: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      additional_properties: this.fb.array([]),
      mark_name: ['', Validators.required],
      model_name: ['', Validators.required],
      type_name: ['', Validators.required],
      first_registration: ['', Validators.required],
      mileage: ['', Validators.required],
      fuel_type: ['', Validators.required],
      color: ['', Validators.required],
      condition: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadVehicleTypes();
  }

  loadVehicleTypes(): void {
    this.vehicleService.getVehicleTypes().subscribe({
      next: (data) => {
        this.vehicleTypes = data;
      },
      error: (error) => {
        console.error('Error loading vehicle types:', error);
      },
    });
  }
  loadVehicleMarks(): void {
    this.vehicleService.getVehicleMarks().subscribe({
      next: (data) => {
        this.vehicleMarks = data;
      },
      error: (error) => {
        console.error('Error loading vehicle Marks:', error);
      },
    });
  }

  get additionalProperties(): FormArray {
    return this.vehicleForm.get('additional_properties') as FormArray;
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
    if (this.vehicleForm.invalid) {
      this.markFormGroupTouched(this.vehicleForm);
      return;
    }

    const additionalPropsArray = this.vehicleForm.get(
      'additional_properties'
    )?.value;
    const additionalPropsObj: { [key: string]: string } = {};
    additionalPropsArray.forEach((item: any) => {
      if (item.key && item.value) {
        additionalPropsObj[item.key] = item.value;
      }
    });

    const newListing: NewVehicleListing = {
      ...this.vehicleForm.value,
      status: 'Available',
      additional_properties: additionalPropsObj,
      // rent_start: new Date(this.realestateForm.get('rent_start')?.value),
      // rent_end: new Date(this.realestateForm.get('rent_end')?.value)
    };

    this.vehicleService.createListing(newListing).subscribe({
      next: (response) => {
        alert(response);
        this.created.emit();
        this.onClose();
      },
      error: (error) => {
        console.error('Error creating listing:', error);
        alert('Fahrzeug konnte nicht erstellt werden. Versuche es erneut.');
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
