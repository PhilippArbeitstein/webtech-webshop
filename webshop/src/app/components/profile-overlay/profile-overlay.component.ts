import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-profile-overlay',
    imports: [CommonModule],
    templateUrl: './profile-overlay.component.html',
    styleUrl: './profile-overlay.component.css'
})
export class ProfileOverlayComponent {
    @Input() isVisible = false;
    @Output() close = new EventEmitter<void>();

    closeOverlay(): void {
        this.close.emit();
    }
}
