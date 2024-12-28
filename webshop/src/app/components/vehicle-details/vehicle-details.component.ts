import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SearchbarService } from '../../services/searchbar.service';
import {
  VehicleListing,
  VehiclesService,
} from '../../services/vehicles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { RoutingService } from '../../services/routing.service';

// Extend RealEstateListing locally to include display properties
type DisplayVehicleListing = VehicleListing;

@Component({
  selector: 'app-vehicle-details',
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css',
  providers: [DatePipe],
})
export class VehicleDetailsComponent {
  productId: number = -1;
  listing: VehicleListing | null = null;

  constructor(
    private searchbarService: SearchbarService,
    public vehicleService: VehiclesService,
    private route: ActivatedRoute,
    private router: Router,
    private routingService: RoutingService
  ) {
    const productIdParam = this.route.snapshot.paramMap.get('product_id');
    this.productId = productIdParam ? Number(productIdParam) : -1;
  }

  ngOnInit(): void {
    this.searchbarService.setSearchBarContext('vehicles');

    // Fetch the listing directly
    this.vehicleService.getListingById(this.productId).subscribe({
      next: (listing) => {
        this.listing = {
          ...listing,

          //rent_start_formatted: this.formatDate(listing.rent_start),
          //rent_end_formatted: this.formatDate(listing.rent_end)
        };
      },
      error: (error) => {
        console.error('Error fetching listing:', error);
      },
    });
    console.log(this.listing);
  }

  ngOnDestroy(): void {
    this.searchbarService.setSearchBarContext(null);
    this.searchbarService.setSearchQuery('');
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  /*
  getPropertyValue(obj: any, key: string): string {
    const value = obj[key];
    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize the key

    if (value === true) {
      return `With ${formattedKey}`; // Example: "With Garage"
    } else if (value === false) {
      return `No ${formattedKey}`; // Optional: "No Garage"
    } else {
      return `${formattedKey}: ${value}`; // Example: "Size: 2000 sqm"
    }
  }
    

  private formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'd. MMM y') || '';
  }
    */

  goBack(): void {
    const previousRoute = this.routingService.getPreviousRoute();
    if (previousRoute == 'own-product') {
      this.router.navigate(['/own-products']);
    } else if (previousRoute == 'messages') {
      this.router.navigate(['/messages']);
    } else {
      this.router.navigate(['/vehicles']);
    }
  }
}
