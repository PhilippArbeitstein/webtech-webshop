import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SearchbarService } from '../../services/searchbar.service';
import {
    RealEstateListing,
    RealestateService
} from '../../services/realestate.service';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RealestateListComponent } from '../realestate-list/realestate-list.component';
import { RealestateCreateOverlayComponent } from '../realestate-create-overlay/realestate-create-overlay.component';

@Component({
    selector: 'app-own-products-page',
    imports: [
        NavbarComponent,
        FooterComponent,
        CommonModule,
        RealestateListComponent,
        RealestateCreateOverlayComponent
    ],
    templateUrl: './own-products-page.component.html',
    styleUrl: './own-products-page.component.css'
})
export class OwnProductsPageComponent {
    userListings$: Observable<RealEstateListing[]> = of([]);
    isOverlayOpen = false; // Overlay visibility state

    constructor(
        private searchbarService: SearchbarService,
        private realestateService: RealestateService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.searchbarService.setSearchBarContext('real-estate');
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

    openOverlay(): void {
        this.isOverlayOpen = true;
    }

    closeOverlay(): void {
        this.isOverlayOpen = false;
    }
}
