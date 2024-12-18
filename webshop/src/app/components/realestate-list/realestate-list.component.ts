import { Component, Input, OnInit } from '@angular/core';
import { RealestateService } from '../../services/realestate.service';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
    selector: 'app-realestate-list',
    imports: [CommonModule, ListItemComponent],
    templateUrl: './realestate-list.component.html',
    styleUrl: './realestate-list.component.css'
})
export class RealestateListComponent {
    constructor(public realestateService: RealestateService) {}

    ngOnInit() {
        this.realestateService.getListings();
        console.log(this.realestateService.listings$);
    }
}
