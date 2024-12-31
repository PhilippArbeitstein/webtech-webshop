import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewRealEstateListing } from '../components/realestate-create-overlay/realestate-create-overlay.component';

export interface RealEstateListing {
    product_id: number;
    user_id: number;
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
    category_id: number;
}

@Injectable({
    providedIn: 'root'
})
export class RealestateService {
    private listingsSubject = new BehaviorSubject<RealEstateListing[]>([]);
    private filteredListingsSubject = new BehaviorSubject<RealEstateListing[]>(
        []
    );
    private categoriesSubject = new BehaviorSubject<any[]>([]);

    listings$: Observable<RealEstateListing[]> =
        this.listingsSubject.asObservable();
    filteredListings$: Observable<RealEstateListing[]> =
        this.filteredListingsSubject.asObservable();
    categories$: Observable<any[]> = this.categoriesSubject.asObservable();

    constructor(private httpClient: HttpClient) {}

    getListings(): void {
        this.httpClient
            .get<{ listings: RealEstateListing[]; categories: any[] }>(
                'http://localhost:3000/real-estate/listings'
            )
            .subscribe({
                next: (response) => {
                    const { listings, categories } = response;

                    // Update listings and categories
                    this.listingsSubject.next(listings);
                    this.filteredListingsSubject.next([...listings]);
                    this.categoriesSubject.next(categories);
                },
                error: (error) => {
                    console.error(
                        'Error fetching listings and categories:',
                        error
                    );
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
            newListing,
            { withCredentials: true }
        );
    }

    getRealestateTypes(): Observable<{ type_id: number; type_name: string }[]> {
        return this.httpClient.get<{ type_id: number; type_name: string }[]>(
            `http://localhost:3000/real-estate/types`
        );
    }

    deleteListing(
        product_id: number
    ): Observable<{ message: string; product_id: string }> {
        return this.httpClient.delete<{ message: string; product_id: string }>(
            `http://localhost:3000/real-estate/${product_id}`,
            { withCredentials: true }
        );
    }

    filterListings(filters: {
        category_id: number | null;
        min_price: number | null;
        max_price: number | null;
        rent_start: string | null;
        rent_end: string | null;
        province: string;
        city: string;
        available_now: boolean;
    }): void {
        const params: { [key: string]: any } = {};

        if (filters.category_id !== null) {
            params['category_id'] = filters.category_id;
        }
        if (filters.min_price !== null) {
            params['min_price'] = filters.min_price;
        }
        if (filters.max_price !== null) {
            params['max_price'] = filters.max_price;
        }
        if (filters.rent_start) {
            params['rent_start'] = filters.rent_start;
        }
        if (filters.rent_end) {
            params['rent_end'] = filters.rent_end;
        }
        if (filters.province) {
            params['province'] = filters.province;
        }
        if (filters.city) {
            params['city'] = filters.city;
        }
        if (filters.available_now) {
            params['available_now'] = filters.available_now;
        }

        this.httpClient
            .get<{ listings: RealEstateListing[]; categories: any[] }>(
                'http://localhost:3000/real-estate/listings',
                { params }
            )
            .subscribe({
                next: (response) => {
                    const { listings, categories } = response;
                    console.log(response);
                    this.filteredListingsSubject.next(listings);
                    this.categoriesSubject.next(categories);
                },
                error: (error) => {
                    console.error('Error filtering listings:', error);
                }
            });
    }
}
