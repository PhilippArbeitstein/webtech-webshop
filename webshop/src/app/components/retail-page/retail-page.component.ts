import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SearchbarService } from '../../services/searchbar.service';

@Component({
    selector: 'app-retail-page',
    imports: [NavbarComponent, FooterComponent],
    templateUrl: './retail-page.component.html',
    styleUrl: './retail-page.component.css'
})
export class RetailPageComponent {
    constructor(private searchbarService: SearchbarService) {}

    ngOnInit(): void {
        this.searchbarService.setSearchBarContext('retail');
    }

    ngOnDestroy(): void {
        this.searchbarService.setSearchBarContext(null);
    }
}
