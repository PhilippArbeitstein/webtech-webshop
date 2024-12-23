import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
}
