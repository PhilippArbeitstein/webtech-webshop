import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewVehicleListing } from '../components/vehicle-create-overlay/vehicle-create-overlay.component';
export interface VehicleListing {
  product_id: number;
  product_name: string;
  email: string;
  username: string;
  image_url: string;
  name: string;
  description: string;
  price: number;
  status_name: string;
  created_at: Date;
  updated_at: Date;
  additional_properties: {
    year?: Date;
    kilometers?: number;
  };
  mark_name: string;
  model_name: string;
  type_name: string;
  first_registration: Date;
  mileage: number;
  fuel_type_name: string;
  color: string;
  condition_name: string;
}
@Injectable({
  providedIn: 'root',
})
export class VehiclesService {
  private listingsSubject = new BehaviorSubject<VehicleListing[]>([]);
  private filteredListingsSubject = new BehaviorSubject<VehicleListing[]>([]);

  listings$: Observable<VehicleListing[]> = this.listingsSubject.asObservable();
  filteredListings$: Observable<VehicleListing[]> =
    this.filteredListingsSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getListings(): void {
    this.httpClient
      .get<VehicleListing[]>('http://localhost:3000/vehicles/')
      .subscribe({
        next: (data) => {
          this.listingsSubject.next(data);
          this.filteredListingsSubject.next([...data]);
        },
        error: (error) => {
          console.error('Error fetching listings:', error);
        },
      });
  }
  getListingById(productId: number): Observable<VehicleListing> {
    return this.httpClient.get<VehicleListing>(
      `http://localhost:3000/vehicles/${productId}`
    );
  }
  getUserSpecificListings(): Observable<VehicleListing[]> {
    return this.httpClient.get<VehicleListing[]>(
      'http://localhost:3000/vehicles/users/user-listings',
      { withCredentials: true }
    );
  }

  createListing(
    newListing: NewVehicleListing
  ): Observable<{ message: string; product_id: string }> {
    return this.httpClient.post<{ message: string; product_id: string }>(
      `http://localhost:3000/vehicles/`,
      newListing,
      { withCredentials: true }
    );
  }

  getVehicleTypes(): Observable<{ type_id: number; type_name: string }[]> {
    return this.httpClient.get<{ type_id: number; type_name: string }[]>(
      `http://localhost:3000/vehicles/types/types`
    );
  }
  getVehicleMarks(): Observable<{ mark_id: number; mark_name: string }[]> {
    return this.httpClient.get<{ mark_id: number; mark_name: string }[]>(
      `http://localhost:3000/vehicles/marks/marks`
    );
  }
  getVehicleFuelTypes(): Observable<
    { fuel_type_id: number; fuel_type_name: string }[]
  > {
    return this.httpClient.get<
      { fuel_type_id: number; fuel_type_name: string }[]
    >(`http://localhost:3000/vehicles/fuel_types/fuel_types`);
  }
  getVehicleConditions(): Observable<
    { condition_id: number; condition_name: string }[]
  > {
    return this.httpClient.get<
      { condition_id: number; condition_name: string }[]
    >(`http://localhost:3000/vehicles/conditions/conditions`);
  }

  deleteListing(
    product_id: number
  ): Observable<{ message: string; product_id: string }> {
    return this.httpClient.delete<{ message: string; product_id: string }>(
      `http://localhost:3000/vehicles/${product_id}`,
      { withCredentials: true }
    );
  }
}
