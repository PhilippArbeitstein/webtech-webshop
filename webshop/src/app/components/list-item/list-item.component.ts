import { Component, Input } from '@angular/core';
import {
    RealEstateListing,
    RealestateService
} from '../../services/realestate.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RealestateUpdateOverlayComponent } from '../realestate-update-overlay/realestate-update-overlay.component';

@Component({
    selector: 'app-list-item',
    imports: [CommonModule, RealestateUpdateOverlayComponent],
    templateUrl: './list-item.component.html',
    styleUrl: './list-item.component.css'
})
export class ListItemComponent {
    @Input() listing!: RealEstateListing;
    @Input() onDeleteCallback!: () => void;
    @Input() onUpdateCallback!: () => void;

    fallbackImageUrl = '../../../assets/house.svg';
    isTrashIconVisible: boolean = false;
    isEditIconVisible: boolean = false;

    imageError: boolean = false;
    showConfirmationPopup: boolean = false;
    currentProductIdToDelete: number | null = null;

    showEditOverlayState: boolean = false;
    selectedListing: RealEstateListing | null = null;

    private routeSubscription: Subscription | null = null;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private realestateService: RealestateService
    ) {}

    ngOnInit(): void {
        this.routeSubscription = this.router.events.subscribe(() => {
            this.checkRoute();
        });
        this.checkRoute();
    }

    openEditOverlay(event: MouseEvent, listing: RealEstateListing): void {
        event.stopPropagation();
        event.preventDefault();
        this.selectedListing = listing;
        this.showEditOverlayState = true;
    }

    closeEditOverlay(event?: MouseEvent): void {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.selectedListing = null;
        this.showEditOverlayState = false;

        if (this.onUpdateCallback) {
            console.log('ja callback');
            this.onUpdateCallback(); // Trigger the update callback
        }
    }

    openConfirmationPopup(event: MouseEvent, productId: number): void {
        event.stopPropagation();
        event.preventDefault();
        this.showConfirmationPopup = true;
        this.currentProductIdToDelete = productId;
    }

    closeConfirmationPopup(event?: MouseEvent): void {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.showConfirmationPopup = false;
        this.currentProductIdToDelete = null;
    }

    onImageError(event: Event): void {
        const imgElement = event.target as HTMLImageElement;
        this.imageError = true;
        imgElement.src = this.fallbackImageUrl;
    }

    ngOnDestroy(): void {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }

    private checkRoute(): void {
        const currentRoute = this.router.url;
        this.isTrashIconVisible = currentRoute.includes('own-products');
        this.isEditIconVisible = currentRoute.includes('own-products');
    }

    confirmDelete(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();
        if (this.currentProductIdToDelete !== null) {
            this.realestateService
                .deleteListing(this.currentProductIdToDelete)
                .subscribe({
                    next: () => {
                        this.showConfirmationPopup = false;
                        this.currentProductIdToDelete = null;

                        if (this.onDeleteCallback) {
                            this.onDeleteCallback();
                        }
                    },
                    error: (error) => {
                        console.error('Error deleting listing:', error);
                        this.showConfirmationPopup = false;
                        this.currentProductIdToDelete = null;
                    }
                });
        }
    }
}
