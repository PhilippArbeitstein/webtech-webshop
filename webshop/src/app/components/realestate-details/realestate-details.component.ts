import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SearchbarService } from '../../services/searchbar.service';
import {
    RealEstateListing,
    RealestateService
} from '../../services/realestate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { RoutingService } from '../../services/routing.service';

// Extend RealEstateListing locally to include display properties
type DisplayRealEstateListing = RealEstateListing & {
    rent_start_formatted?: string;
    rent_end_formatted?: string;
};

@Component({
    selector: 'app-realestate-details',
    imports: [NavbarComponent, FooterComponent, CommonModule],
    templateUrl: './realestate-details.component.html',
    styleUrl: './realestate-details.component.css',
    providers: [DatePipe]
})
export class RealestateDetailsComponent {
    productId: number = -1;
    listing: DisplayRealEstateListing | null = null;

    constructor(
        private searchbarService: SearchbarService,
        public realestateService: RealestateService,
        private route: ActivatedRoute,
        private router: Router,
        private datePipe: DatePipe,
        private routingService: RoutingService
    ) {
        const productIdParam = this.route.snapshot.paramMap.get('product_id');
        this.productId = productIdParam ? Number(productIdParam) : -1;
    }

    ngOnInit(): void {
        this.searchbarService.setSearchBarContext('real-estate');

        // Fetch the listing directly
        this.realestateService.getListingById(this.productId).subscribe({
            next: (listing) => {
                this.listing = {
                    ...listing,
                    rent_start_formatted: this.formatDate(listing.rent_start),
                    rent_end_formatted: this.formatDate(listing.rent_end)
                };
            },
            error: (error) => {
                console.error('Error fetching listing:', error);
            }
        });
    }

    ngOnDestroy(): void {
        this.searchbarService.setSearchBarContext(null);
        this.searchbarService.setSearchQuery('');
    }

    objectKeys(obj: any): string[] {
        return obj ? Object.keys(obj) : [];
    }

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

    goBack(): void {
        const previousRoute = this.routingService.getPreviousRoute();
        if (previousRoute == 'own-product') {
            this.router.navigate(['/own-products']);
        } else if (previousRoute == 'messages') {
            this.router.navigate(['/messages']);
        } else {
            this.router.navigate(['/real-estate']);
        }
    }
}
