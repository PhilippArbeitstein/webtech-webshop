import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RoutingService {
    private previousRoute: string | null = null;

    constructor() {}

    setPreviousRoute(route: string): void {
        this.previousRoute = route;
    }

    getPreviousRoute(): string | null {
        return this.previousRoute;
    }
}
