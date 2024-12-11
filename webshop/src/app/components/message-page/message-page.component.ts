import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-message-page',
    imports: [NavbarComponent, FooterComponent],
    templateUrl: './message-page.component.html',
    styleUrl: './message-page.component.css'
})
export class MessagePageComponent {}
