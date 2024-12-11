import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProfileOverlayComponent } from '../profile-overlay/profile-overlay.component';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, CommonModule, ProfileOverlayComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    isLoggedIn$!: Observable<boolean>;
    isOverlayVisible = false;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.isLoggedIn$ = this.authService.isLoggedIn$;
    }

    openProfileOverlay(): void {
        this.isOverlayVisible = true;
    }

    closeProfileOverlay(): void {
        this.isOverlayVisible = false;
    }
}
