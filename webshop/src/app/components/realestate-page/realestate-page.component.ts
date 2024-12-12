import { Component } from '@angular/core';
import { SearchbarService } from '../../services/searchbar.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-realestate-page',
    imports: [NavbarComponent, FooterComponent],
    templateUrl: './realestate-page.component.html',
    styleUrl: './realestate-page.component.css'
})
export class RealestatePageComponent {
    constructor(private searchbarService: SearchbarService) {}

    ngOnInit(): void {
        this.searchbarService.setSearchBarContext('real-estate');
    }

    ngOnDestroy(): void {
        this.searchbarService.setSearchBarContext(null);
    }
}
