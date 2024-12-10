import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-landing-page',
    imports: [NavbarComponent],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {}
