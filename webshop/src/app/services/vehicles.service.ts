import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
export interface VehicleListing {
  product_id: number;
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
      year?: string;
      kilometers?: boolean;
  };
  mark_name: string;
  model_name: string;
  type_name: string;
  first_registration: string;
  mileage: string;
  fuel_type_name: number;
  color: Date;
  condition_name: Date;
}
@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
    private listingsSubject = new BehaviorSubject<VehicleListing[]>([]);
    private filteredListingsSubject = new BehaviorSubject<VehicleListing[]>(
        []
    );

    listings$: Observable<VehicleListing[]> =
        this.listingsSubject.asObservable();
    filteredListings$: Observable<VehicleListing[]> =
        this.filteredListingsSubject.asObservable();

    constructor(private httpClient: HttpClient) {}
}
