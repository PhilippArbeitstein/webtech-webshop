import { Component, Input } from '@angular/core';
import { RealEstateListing } from '../../services/realestate.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-list-item',
    imports: [CommonModule],
    templateUrl: './list-item.component.html',
    styleUrl: './list-item.component.css'
})
export class ListItemComponent {
    @Input() listing!: RealEstateListing;
    fallbackImageUrl = '../../../assets/house.svg';

    imageError: boolean = false;

    onImageError(event: Event): void {
        const imgElement = event.target as HTMLImageElement;
        this.imageError = true;
        imgElement.src = this.fallbackImageUrl; // Replace with fallback image
    }
}
