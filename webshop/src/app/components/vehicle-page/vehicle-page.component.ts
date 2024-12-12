import { Component } from '@angular/core';
import { SearchbarService } from '../../services/searchbar.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-vehicle-page',
    imports: [NavbarComponent, FooterComponent],
    templateUrl: './vehicle-page.component.html',
    styleUrl: './vehicle-page.component.css'
})
export class VehiclePageComponent {
    constructor(private searchbarService: SearchbarService) {}

    ngOnInit(): void {
        this.searchbarService.setSearchBarContext('vehicles');
    }

    ngOnDestroy(): void {
        this.searchbarService.setSearchBarContext(null);
    }
}
