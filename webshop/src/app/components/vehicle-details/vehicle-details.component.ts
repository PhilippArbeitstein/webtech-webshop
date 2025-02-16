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
import { UserService } from '../../services/user.service';
import { RoutingService } from '../../services/routing.service';

// Extend VehicleListing locally to include display properties
type DisplayVehicleListing = VehicleListing & {
  year?: string;
};

@Component({
  selector: 'app-vehicle-details',
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css',
  providers: [DatePipe],
})
export class VehicleDetailsComponent {
  loggedInUser: any;
  productId: number = -1;
  listing: DisplayVehicleListing | null = null;

  constructor(
    private searchbarService: SearchbarService,
    public vehicleService: VehiclesService,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private routingService: RoutingService
  ) {
    const productIdParam = this.route.snapshot.paramMap.get('product_id');
    this.productId = productIdParam ? Number(productIdParam) : -1;
  }

  ngOnInit(): void {
    this.userService.loggedInUser$.subscribe((user) => {
      this.loggedInUser = user;
    });
    this.searchbarService.setSearchBarContext('vehicles');

    // Fetch the listing directly
    this.vehicleService.getListingById(this.productId).subscribe({
      next: (listing) => {
        this.listing = {
          ...listing,
          year: this.formatDate(listing.first_registration),
        };
      },
      error: (error) => {
        console.error('Error fetching listing:', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.searchbarService.setSearchBarContext(null);
    this.searchbarService.setSearchQuery('');
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  private formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'd. MMM y') || '';
  }

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
  startNewChat(): void {
    if (!this.listing) {
      return; // Ensure the listing is available
    }

    const productId = this.listing.product_id;
    const ownerId = this.listing.user_id;

    this.router.navigate(['/messages'], {
      queryParams: { product_id: productId, to_user_id: ownerId },
    });
  }
}
