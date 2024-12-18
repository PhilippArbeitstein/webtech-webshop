import { Component } from '@angular/core';
import { SearchbarService } from '../../services/searchbar.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    imports: [CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent {
    constructor(public searchbarService: SearchbarService) {}
}
