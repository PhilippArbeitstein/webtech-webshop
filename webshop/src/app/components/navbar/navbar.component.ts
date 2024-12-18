import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProfileOverlayComponent } from '../profile-overlay/profile-overlay.component';
import { OverlayService } from '../../services/overlay.service';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { SearchbarService } from '../../services/searchbar.service';
@Component({
    selector: 'app-navbar',
    imports: [
        RouterLink,
        CommonModule,
        ProfileOverlayComponent,
        RouterLinkActive,
        SearchbarComponent
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    isLoggedIn$!: Observable<boolean>;

    constructor(
        private authService: AuthService,
        public overlayService: OverlayService,
        public searchbarService: SearchbarService
    ) {}

    ngOnInit() {
        this.isLoggedIn$ = this.authService.isLoggedIn$;
    }
}
