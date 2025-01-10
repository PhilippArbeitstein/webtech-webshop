import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OverlayService } from '../../services/overlay.service';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-profile-overlay',
    imports: [CommonModule, RouterLink],
    templateUrl: './profile-overlay.component.html',
    styleUrl: './profile-overlay.component.css'
})
export class ProfileOverlayComponent {
    loggedInUser: any;

    constructor(
        public authService: AuthService,
        public overlayService: OverlayService,
        public userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.userService.loggedInUser$.subscribe((user) => {
            this.loggedInUser = user;
        });
    }

    onLogout() {
        this.authService.logout().subscribe({
            next: (response) => {
                this.router.navigate(['']);
            },
            error: (err) => {
                console.error('Logout failed:', err);
            }
        });
    }
}
