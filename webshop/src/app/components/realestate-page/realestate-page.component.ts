import { Component, ElementRef, ViewChild } from '@angular/core';
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
    @ViewChild('scrollableContainer', { static: false })
    scrollableContainer!: ElementRef;

    @ViewChild(RealestateDetailedFilterComponent, { static: false })
    filterComponent!: RealestateDetailedFilterComponent;

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

    ngAfterViewInit(): void {
        this.scrollableContainer.nativeElement.addEventListener(
            'scroll',
            this.onScroll.bind(this)
        );
    }

    ngOnDestroy(): void {
        this.searchbarService.setSearchBarContext(null);
        this.searchbarService.setSearchQuery('');

        if (this.scrollableContainer) {
            this.scrollableContainer.nativeElement.removeEventListener(
                'scroll',
                this.onScroll
            );
        }
    }

    onScroll(): void {
        if (this.filterComponent && !this.filterComponent.filterCollapsed) {
            this.filterComponent.collapseFilterOnScroll();
        }
    }
}
