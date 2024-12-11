import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class OverlayService {
    isOverlayVisible: boolean = false;

    constructor() {}

    openOverlay(): void {
        this.isOverlayVisible = true;
    }

    closeOverlay(): void {
        this.isOverlayVisible = false;
    }
}
