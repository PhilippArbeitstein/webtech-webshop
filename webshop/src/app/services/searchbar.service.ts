import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SearchbarService {
    private showSearchBar = new BehaviorSubject<boolean>(false);
    private searchBarContext = new BehaviorSubject<string | null>(null);
    private searchQuery = new BehaviorSubject<string>('');

    showSearchBar$: Observable<boolean> = this.showSearchBar.asObservable();
    searchBarContext$: Observable<string | null> =
        this.searchBarContext.asObservable();
    searchQuery$: Observable<string> = this.searchQuery.asObservable();

    constructor() {}

    setSearchBarContext(context: string | null): void {
        this.searchBarContext.next(context);

        if (context === null) {
            this.setShowSearchBar(false);
        } else {
            const validContexts = ['retail', 'vehicles', 'real-estate'];
            this.setShowSearchBar(validContexts.includes(context));
        }
    }

    private setShowSearchBar(show: boolean): void {
        this.showSearchBar.next(show);
    }

    setSearchQuery(query: string): void {
        this.searchQuery.next(query);
    }
}
