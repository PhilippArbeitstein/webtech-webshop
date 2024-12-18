import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SearchbarService } from '../../services/searchbar.service';

@Component({
    selector: 'app-realestate-details',
    imports: [NavbarComponent, FooterComponent],
    templateUrl: './realestate-details.component.html',
    styleUrl: './realestate-details.component.css'
})
export class RealestateDetailsComponent {
    constructor(private searchbarService: SearchbarService) {}

    ngOnInit(): void {
        this.searchbarService.setSearchBarContext('real-estate');
    }

    ngOnDestroy(): void {
        this.searchbarService.setSearchBarContext(null);
    }
}
