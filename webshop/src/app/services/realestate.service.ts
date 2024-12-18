import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewRealEstateListing } from '../components/realestate-create-overlay/realestate-create-overlay.component';

export interface RealEstateListing {
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
        size?: string;
        garage?: boolean;
        garden?: boolean;
        bedrooms?: number;
        bathrooms?: number;
    };
    type_name: string;
    city: string;
    address: string;
    province: string;
    address_details: string;
    advance_payment: number;
    rent_start: Date;
    rent_end: Date;
}

@Injectable({
    providedIn: 'root'
})
export class RealestateService {
    private listingsSubject = new BehaviorSubject<RealEstateListing[]>([]);
    private filteredListingsSubject = new BehaviorSubject<RealEstateListing[]>(
        []
    );

    listings$: Observable<RealEstateListing[]> =
        this.listingsSubject.asObservable();
    filteredListings$: Observable<RealEstateListing[]> =
        this.filteredListingsSubject.asObservable();

    constructor(private httpClient: HttpClient) {}

    getListings(): void {
        this.httpClient
            .get<RealEstateListing[]>(
                'http://localhost:3000/real-estate/listings'
            )
            .subscribe({
                next: (data) => {
                    this.listingsSubject.next(data);
                    this.filteredListingsSubject.next([...data]);
                },
                error: (error) => {
                    console.error('Error fetching listings:', error);
                }
            });
    }

    getListingById(productId: number): Observable<RealEstateListing> {
        return this.httpClient.get<RealEstateListing>(
            `http://localhost:3000/real-estate/listings/${productId}`
        );
    }

    getUserSpecificListings(): Observable<RealEstateListing[]> {
        return this.httpClient.get<RealEstateListing[]>(
            'http://localhost:3000/real-estate/user-listings',
            { withCredentials: true }
        );
    }

    createListing(
        newListing: NewRealEstateListing
    ): Observable<{ message: string; product_id: string }> {
        return this.httpClient.post<{ message: string; product_id: string }>(
            `http://localhost:3000/real-estate/new`,
            newListing
        );
    }
}
