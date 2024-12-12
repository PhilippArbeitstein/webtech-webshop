import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-own-products-page',
    imports: [NavbarComponent, FooterComponent],
    templateUrl: './own-products-page.component.html',
    styleUrl: './own-products-page.component.css'
})
export class OwnProductsPageComponent {}
