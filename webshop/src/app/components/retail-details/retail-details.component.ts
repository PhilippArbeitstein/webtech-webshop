import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SearchbarService } from '../../services/searchbar.service';
import { RetailListing, RetailsService } from '../../services/retail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { RoutingService } from '../../services/routing.service';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-retail-details',
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './retail-details.component.html',
  styleUrl: './retail-details.component.css',
  providers: [DatePipe],
})
export class RetailDetailsComponent {
  productId: number = -1;
  listing: RetailListing | null = null;
  loggedInUser: any;

  constructor(
    private searchbarService: SearchbarService,
    public retailService: RetailsService,
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
    this.searchbarService.setSearchBarContext('retail');
    this.retailService.getListingById(this.productId).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          const listingData = data[0];
          this.listing = {
            ...listingData,
            price: Number(listingData.price),
          };
        } else {
          console.error('No listing data found for productId:', this.productId);
        }
      },
      error: (error) => {
        console.error('Error fetching listing:', error);
      },
    });
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

  ngOnDestroy(): void {
    this.searchbarService.setSearchBarContext(null);
    this.searchbarService.setSearchQuery('');
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  goBack(): void {
    const previousRoute = this.routingService.getPreviousRoute();
    if (previousRoute == 'own-product') {
      this.router.navigate(['/own-products']);
    } else if (previousRoute == 'messages') {
      this.router.navigate(['/messages']);
    } else {
      this.router.navigate(['/retail']);
    }
  }
}
