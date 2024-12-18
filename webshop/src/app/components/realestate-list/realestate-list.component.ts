import { Component, Input, OnInit } from '@angular/core';
import {
    RealEstateListing,
    RealestateService
} from '../../services/realestate.service';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from '../list-item/list-item.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-realestate-list',
    imports: [CommonModule, ListItemComponent, RouterLink],
    templateUrl: './realestate-list.component.html',
    styleUrl: './realestate-list.component.css'
})
export class RealestateListComponent {
    constructor(public realestateService: RealestateService) {}
    @Input() listings: RealEstateListing[] = [];

    ngOnInit() {
        //this.realestateService.getListings();
    }
}
