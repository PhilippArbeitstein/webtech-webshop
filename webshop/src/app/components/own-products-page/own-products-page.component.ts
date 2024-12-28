import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SearchbarService } from '../../services/searchbar.service';
import {
  RealEstateListing,
  RealestateService,
} from '../../services/realestate.service';
import {
  VehicleListing,
  VehiclesService,
} from '../../services/vehicles.service';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RealestateListComponent } from '../realestate-list/realestate-list.component';
import { VehiclesListComponent } from '../vehicles-list/vehicle-list.component';
import { RealestateCreateOverlayComponent } from '../realestate-create-overlay/realestate-create-overlay.component';
import { VehicleCreateOverlayComponent } from '../vehicle-create-overlay/vehicle-create-overlay.component';

@Component({
  selector: 'app-own-products-page',
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    RealestateListComponent,
    RealestateCreateOverlayComponent,
    VehiclesListComponent,
    VehicleCreateOverlayComponent,
  ],
  templateUrl: './own-products-page.component.html',
  styleUrl: './own-products-page.component.css',
})
export class OwnProductsPageComponent {
  userListings$: Observable<RealEstateListing[]> = of([]);
  userVehiclesListings$: Observable<VehicleListing[]> = of([]);
  isVehicleOverlayOpen = false;
  isOverlayOpen = false;

  constructor(
    private searchbarService: SearchbarService,
    private realestateService: RealestateService,
    private vehicleService: VehiclesService,
    private authService: AuthService
  ) {}

  loadUserListings(): void {
    this.userListings$ = this.authService.isLoggedIn$.pipe(
      switchMap((user) => {
        if (user) {
          return this.realestateService.getUserSpecificListings();
        } else {
          return of([]);
        }
      })
    );
  }
  loadUserVehicleListings(): void {
    this.userVehiclesListings$ = this.authService.isLoggedIn$.pipe(
      switchMap((user) => {
        if (user) {
          return this.vehicleService.getUserSpecificListings();
        } else {
          return of([]);
        }
      })
    );
  }

  ngOnInit() {
    this.searchbarService.setSearchBarContext('own-products');
    this.loadUserListings();
    this.loadUserVehicleListings();
  }

  ngOnDestroy() {
    this.searchbarService.setSearchQuery('');
  }

  closeOverlay(): void {
    this.isOverlayOpen = false;
    this.loadUserListings();
  }

  openOverlay(): void {
    this.isOverlayOpen = true;
  }
  openVehicleOverlay(): void {
    this.isVehicleOverlayOpen = true;
  }
  closeVehicleOverlay(): void {
    this.isVehicleOverlayOpen = false;
    this.loadUserListings();
  }
}
