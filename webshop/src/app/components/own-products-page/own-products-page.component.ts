import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SearchbarService } from '../../services/searchbar.service';
import {
    RealEstateListing,
    RealestateService
} from '../../services/realestate.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListItemComponent } from '../list-item/list-item.component';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-own-products-page',
    imports: [
        NavbarComponent,
        FooterComponent,
        CommonModule,
        RouterLink,
        ListItemComponent
    ],
    templateUrl: './own-products-page.component.html',
    styleUrl: './own-products-page.component.css'
})
export class OwnProductsPageComponent {
    userListings$!: Observable<RealEstateListing[]>;
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
                    return []; // Return empty if user not logged in
                }
            })
        );
    }
}
