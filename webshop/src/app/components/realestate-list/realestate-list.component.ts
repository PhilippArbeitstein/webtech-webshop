import { Component, Input, OnInit } from '@angular/core';
import {
    RealEstateListing,
    RealestateService
} from '../../services/realestate.service';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from '../list-item/list-item.component';
import { RouterLink } from '@angular/router';
import { RoutingService } from '../../services/routing.service';

@Component({
    selector: 'app-realestate-list',
    imports: [CommonModule, ListItemComponent, RouterLink],
    templateUrl: './realestate-list.component.html',
    styleUrl: './realestate-list.component.css'
})
export class RealestateListComponent {
    constructor(
        public realestateService: RealestateService,
        private routingService: RoutingService
    ) {}
    @Input() listings: RealEstateListing[] = [];

    ngOnInit() {
        location.pathname.includes('own-product')
            ? this.routingService.setPreviousRoute('own-product')
            : this.routingService.setPreviousRoute('real-estate');
    }
}
