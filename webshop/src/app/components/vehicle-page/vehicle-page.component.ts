import { Component } from '@angular/core';
import { SearchbarService } from '../../services/searchbar.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { VehiclesListComponent } from '../vehicles-list/vehicle-list.component';
import {
  VehicleListing,
  VehiclesService,
} from '../../services/vehicles.service';

@Component({
  selector: 'app-vehicle-page',
  imports: [NavbarComponent, FooterComponent, VehiclesListComponent],
  templateUrl: './vehicle-page.component.html',
  styleUrl: './vehicle-page.component.css',
})
export class VehiclePageComponent {
  vehiclesListings: VehicleListing[] = [];

  constructor(
    private searchbarService: SearchbarService,
    private vehiclesService: VehiclesService
  ) {}

  ngOnInit(): void {
    this.searchbarService.setSearchBarContext('vehicles');
    this.vehiclesService.getListings();
    this.vehiclesService.listings$.subscribe({
      next: (listings) => (this.vehiclesListings = listings),
      error: (error) => console.error('Error fetching listings:', error),
    });
  }

  ngOnDestroy(): void {
    this.searchbarService.setSearchBarContext(null);
    this.searchbarService.setSearchQuery('');
  }
}
