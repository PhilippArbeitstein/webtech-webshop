import { Component } from '@angular/core';
import { SearchbarService } from '../../services/searchbar.service';

@Component({
    selector: 'app-searchbar',
    imports: [],
    templateUrl: './searchbar.component.html',
    styleUrl: './searchbar.component.css'
})
export class SearchbarComponent {
    constructor(private searchbarService: SearchbarService) {}

    onSearch(query: string): void {
        this.searchbarService.setSearchQuery(query);
    }
}
