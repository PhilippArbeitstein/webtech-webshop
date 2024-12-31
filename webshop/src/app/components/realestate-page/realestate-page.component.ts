import { Component } from '@angular/core';
import { SearchbarService } from '../../services/searchbar.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RealestateListComponent } from '../realestate-list/realestate-list.component';
import {
    RealEstateListing,
    RealestateService
} from '../../services/realestate.service';
import { RealestateDetailedFilterComponent } from '../realestate-detailed-filter/realestate-detailed-filter.component';

@Component({
    selector: 'app-realestate-page',
    imports: [
        NavbarComponent,
        FooterComponent,
        RealestateListComponent,
        RealestateDetailedFilterComponent
    ],
    templateUrl: './realestate-page.component.html',
    styleUrl: './realestate-page.component.css'
})
export class RealestatePageComponent {
    realEstateListings: RealEstateListing[] = [];

    constructor(
        private searchbarService: SearchbarService,
        private realestateService: RealestateService
    ) {}

    ngOnInit(): void {
        this.searchbarService.setSearchBarContext('real-estate');

        this.realestateService.filteredListings$.subscribe({
            next: (listings) => (this.realEstateListings = listings),
            error: (error) =>
                console.error('Error fetching filtered listings:', error)
        });

        this.realestateService.getListings();
    }

    ngOnDestroy(): void {
        this.searchbarService.setSearchBarContext(null);
        this.searchbarService.setSearchQuery('');
    }
}
