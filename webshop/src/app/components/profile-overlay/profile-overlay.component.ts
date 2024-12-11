import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OverlayService } from '../../services/overlay.service';

@Component({
    selector: 'app-profile-overlay',
    imports: [CommonModule],
    templateUrl: './profile-overlay.component.html',
    styleUrl: './profile-overlay.component.css'
})
export class ProfileOverlayComponent {
    constructor(
        public authService: AuthService,
        public overlayService: OverlayService
    ) {}

    onLogout() {
        this.authService.logout().subscribe({
            next: (response) => {
                console.log('Logout response:', response);
            },
            error: (err) => {
                console.error('Logout failed:', err);
            }
        });
    }
}
