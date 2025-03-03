import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { NewRetailListing } from '../components/retail-create-overlay/retail-create-overlay.component';
import { UpdatedRetailListing } from '../components/retail-update-overlay/retail-update-overlay.component';
export interface RetailListing {
  product_id: number;
  product_name: string;
  email: string;
  username: string;
  user_id: number;
  image_url: string;
  name: string;
  description: string;
  price: number;
  status_name: string;
  created_at: Date;
  updated_at: Date;
  additional_properties: {};
  condition_name: string;
  delivery_method_name: string;
  category: string;
}
@Injectable({
  providedIn: 'root',
})
export class RetailsService {
  private listingsSubject = new BehaviorSubject<RetailListing[]>([]);
  private filteredListingsSubject = new BehaviorSubject<RetailListing[]>([]);

  listings$: Observable<RetailListing[]> = this.listingsSubject.asObservable();
  filteredListings$: Observable<RetailListing[]> =
    this.filteredListingsSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getListings(): void {
    this.httpClient
      .get<RetailListing[]>('http://localhost:3000/retail/')
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
  getListingById(productId: number): Observable<RetailListing> {
    return this.httpClient.get<RetailListing>(
      `http://localhost:3000/retail/${productId}`
    );
  }
  getUserSpecificListings(): Observable<RetailListing[]> {
    return this.httpClient.get<RetailListing[]>(
      'http://localhost:3000/retail/users/user-listings',
      { withCredentials: true }
    );
  }

  createListing(
    newListing: NewRetailListing
  ): Observable<{ message: string; product_id: string }> {
    return this.httpClient.post<{ message: string; product_id: string }>(
      `http://localhost:3000/retail/new`,
      newListing,
      { withCredentials: true }
    );
  }

  getRetailConditions(): Observable<
    { condition_id: number; condition_name: string }[]
  > {
    return this.httpClient.get<
      { condition_id: number; condition_name: string }[]
    >(`http://localhost:3000/retail/conditions/conditions`);
  }

  getRetailDeliveryMethods(): Observable<
    { delivery_method_id: number; delivery_method_name: string }[]
  > {
    return this.httpClient.get<
      { delivery_method_id: number; delivery_method_name: string }[]
    >(`http://localhost:3000/retail/delivery/methods`);
  }

  getRetailStatuses(): Observable<
    { status_id: number; status_name: string }[]
  > {
    return this.httpClient.get<{ status_id: number; status_name: string }[]>(
      `http://localhost:3000/retail/status/status`
    );
  }
  getRetailCategories(): Observable<any> {
    return this.httpClient
      .get<
        {
          category_id: number;
          parent_category_id: number | null;
          name: string;
          additional_properties: { type: string };
        }[]
      >(`http://localhost:3000/retail/categories/categories`)
      .pipe(map((categories) => this.buildCategoryTree(categories)));
  }

  private buildCategoryTree(
    categories: {
      category_id: number;
      parent_category_id: number | null;
      name: string;
      additional_properties: { type: string };
    }[]
  ): any[] {
    const categoryMap = new Map<number, any>();

    // Create a map with category_id as the key
    categories.forEach((category) => {
      categoryMap.set(category.category_id, { ...category, children: [] });
    });

    const tree: any[] = [];

    categories.forEach((category) => {
      if (category.parent_category_id === null) {
        // Add root categories to the tree
        tree.push(categoryMap.get(category.category_id));
      } else {
        // Add as a child to its parent
        const parent = categoryMap.get(category.parent_category_id);
        if (parent) {
          parent.children.push(categoryMap.get(category.category_id));
        }
      }
    });

    return tree;
  }

  deleteListing(
    product_id: number
  ): Observable<{ message: string; product_id: string }> {
    return this.httpClient.delete<{ message: string; product_id: string }>(
      `http://localhost:3000/retail/${product_id}`,
      { withCredentials: true }
    );
  }

  updateListing(
    productId: number,
    updatedListing: UpdatedRetailListing
  ): Observable<{ message: string; product_id: string }> {
    return this.httpClient.put<{ message: string; product_id: string }>(
      `http://localhost:3000/retail/update/${productId}`,
      updatedListing,
      { withCredentials: true }
    );
  }
}
