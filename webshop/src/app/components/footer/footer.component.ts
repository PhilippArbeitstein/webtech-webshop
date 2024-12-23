import { Component, Input } from '@angular/core';
import { SearchbarService } from '../../services/searchbar.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    imports: [CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent {
    @Input() show: boolean = true;
    constructor(public searchbarService: SearchbarService) {}
}
