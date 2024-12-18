import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SearchbarService } from '../../services/searchbar.service';
import {
    RealEstateListing,
    RealestateService
} from '../../services/realestate.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

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
    listing: DisplayRealEstateListing = {} as DisplayRealEstateListing;

    constructor(
        private searchbarService: SearchbarService,
        public realestateService: RealestateService,
        private route: ActivatedRoute,
        private datePipe: DatePipe
    ) {
        const productIdParam = this.route.snapshot.paramMap.get('product_id');
        this.productId = productIdParam ? Number(productIdParam) : -1;
    }

    ngOnInit(): void {
        this.searchbarService.setSearchBarContext('real-estate');

        // Fetch the listing by ID
        const listing = this.realestateService.getListingById(this.productId);
        if (listing) {
            // Add formatted date fields while preserving original data
            this.listing = {
                ...listing,
                rent_start_formatted: this.formatDate(listing.rent_start),
                rent_end_formatted: this.formatDate(listing.rent_end)
            };
        } else {
            console.error('Listing not found for ID:', this.productId);
        }
    }

    ngOnDestroy(): void {
        this.searchbarService.setSearchBarContext(null);
    }

    objectKeys(obj: any): string[] {
        return obj ? Object.keys(obj) : [];
    }

    getPropertyValue(obj: any, key: string): any {
        return obj[key];
    }

    private formatDate(date: string | Date): string {
        return this.datePipe.transform(date, 'd. MMM y') || '';
    }
}
