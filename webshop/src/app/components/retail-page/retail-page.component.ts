import { Component } from '@angular/core';
import { SearchbarService } from '../../services/searchbar.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RetailListComponent } from '../retail-list/retail-list.component';
import {
  RetailListing,
  RetailsService,
} from '../../services/retail.service';

@Component({
  selector: 'app-retail-page',
  imports: [NavbarComponent, FooterComponent, RetailListComponent],
  templateUrl: './retail-page.component.html',
  styleUrl: './retail-page.component.css',
})
export class RetailPageComponent {
  retailListings: RetailListing[] = [];

  constructor(
    private searchbarService: SearchbarService,
    private retailService: RetailsService
  ) {}

  ngOnInit(): void {
    this.searchbarService.setSearchBarContext('retail');
    this.retailService.getListings();
    this.retailService.listings$.subscribe({
      next: (listings) => (this.retailListings = listings),
      error: (error) => console.error('Error fetching listings:', error),
    });
  }

  ngOnDestroy(): void {
    this.searchbarService.setSearchBarContext(null);
    this.searchbarService.setSearchQuery('');
  }
}
