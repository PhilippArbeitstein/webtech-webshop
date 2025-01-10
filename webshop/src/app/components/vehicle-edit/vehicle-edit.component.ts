import { Component, EventEmitter, Output } from '@angular/core';
import {
  VehiclesService,
  VehicleListing,
} from '../../services/vehicles.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
export interface EditVehicleListing {
  product_id: number;
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
  selector: 'app-vehicle-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.css'],
})
export class VehicleEditComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();
  productId: number = -1;
  isLoading = true;
  listing: VehicleListing | null = null;
  vehicleForm!: FormGroup;
  vehicleTypes: { type_id: number; type_name: string }[] = [];
  vehicleMarks: { mark_id: number; mark_name: string }[] = [];
  vehicleFuelTypes: { fuel_type_id: number; fuel_type_name: string }[] = [];
  vehicleConditions: { condition_id: number; condition_name: string }[] = [];
  statuses: { status_id: number; status_name: string }[] = [];
  constructor(
    private routingService: RoutingService,
    private fb: FormBuilder,
    private vehicleService: VehiclesService,
    private route: ActivatedRoute
  ) {
    const productIdParam = this.route.snapshot.paramMap.get('product_id');
    this.productId = productIdParam ? Number(productIdParam) : -1;
    // Initialize the form using FormBuilder
  }

  ngOnInit(): void {
    location.pathname.includes('vehicle-edit')
      ? this.routingService.setPreviousRoute('own-product')
      : this.routingService.setPreviousRoute('vehicles');
    Promise.all([
      this.loadVehicleTypes(),
      this.loadVehicleMarks(),
      this.loadVehicleFuelTypes(),
      this.loadVehicleConditions(),
      this.loadStatuses(),
      this.loadListing(),
    ]).then(() => {
      this.isLoading = false; // Data fully loaded
    });

    this.vehicleForm = this.fb.group({
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
      mark_name: [this.listing?.mark_name || '', Validators.required],
      model_name: [this.listing?.model_name || '', Validators.required],
      type_name: [this.listing?.type_name || '', Validators.required],
      first_registration: [
        this.listing?.first_registration || '',
        Validators.required,
      ],
      mileage: [this.listing?.mileage || '', Validators.required],
      fuel_type: [this.listing?.fuel_type_name || '', Validators.required],
      color: [this.listing?.color || '', Validators.required],
      condition: [this.listing?.condition_name || '', Validators.required],
      status: [this.listing?.status_name || '', Validators.required],
    });
  }
  async loadListing(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.vehicleService.getListingById(this.productId).subscribe({
        next: (listing) => {
          this.listing = listing;
          // Populate the form once the listing is fetched
          this.vehicleForm.patchValue({
            image_url: listing.image_url || '',
            name: listing.name || '',
            description: listing.description || '',
            price: listing.price || null,
            mark_name: listing.mark_name || '',
            model_name: listing.model_name || '',
            type_name: listing.type_name || '',
            first_registration: listing.first_registration || '',
            mileage: listing.mileage || null,
            fuel_type: listing.fuel_type_name || '',
            color: listing.color || '',
            condition: listing.condition_name || '',
            status: listing.status_name || '',
          });
          resolve();
        },
        error: (error) => {
          console.error('Error fetching listing:', error);
          reject(error);
        },
      });
    });
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
  loadVehicleFuelTypes(): void {
    this.vehicleService.getVehicleFuelTypes().subscribe({
      next: (data) => {
        this.vehicleFuelTypes = data;
      },
      error: (error) => {
        console.error('Error loading vehicle Fuel Types:', error);
      },
    });
  }
  loadVehicleConditions(): void {
    this.vehicleService.getVehicleConditions().subscribe({
      next: (data) => {
        this.vehicleConditions = data;
      },
      error: (error) => {
        console.error('Error loading vehicle Marks:', error);
      },
    });
  }
  loadStatuses(): void {
    this.vehicleService.getStatuses().subscribe({
      next: (data) => {
        this.statuses = data;
      },
      error: (error) => {
        console.error('Error loading statuses:', error);
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

    const newListing: EditVehicleListing = {
      ...this.vehicleForm.value,
      product_id: this.productId,
      additional_properties: additionalPropsObj,

      // rent_start: new Date(this.realestateForm.get('rent_start')?.value),
      // rent_end: new Date(this.realestateForm.get('rent_end')?.value)
    };

    this.vehicleService.editListing(newListing).subscribe({
      next: (response) => {
        alert(response);
        this.created.emit();
        this.onClose();
      },
      error: (error) => {
        console.error('Error creating listing:', error);
        alert('Fahrzeug konnte nicht editiert werden. Versuche es erneut.');
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
