import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SearchbarService } from '../../services/searchbar.service';
import {
    RealEstateListing,
    RealestateService
} from '../../services/realestate.service';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap, tap } from 'rxjs';
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
    isOverlayOpen = false;

    constructor(
        private searchbarService: SearchbarService,
        private realestateService: RealestateService,
        private authService: AuthService
    ) {}

    private loadUserListings(): void {
        this.userListings$ = this.authService.isLoggedIn$.pipe(
            switchMap((user) => {
                if (user) {
                    return this.realestateService
                        .getUserSpecificListings()
                        .pipe(
                            tap((listings) =>
                                console.log('Listings fetched:', listings)
                            )
                        );
                } else {
                    return of([]);
                }
            })
        );
    }

    ngOnInit() {
        this.searchbarService.setSearchBarContext('real-estate');
        this.loadUserListings();
    }

    closeOverlay(): void {
        this.isOverlayOpen = false;
        this.loadUserListings();
    }

    openOverlay(): void {
        this.isOverlayOpen = true;
    }
}
