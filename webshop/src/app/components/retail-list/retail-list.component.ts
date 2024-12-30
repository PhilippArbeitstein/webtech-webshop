import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import {
  VehicleListing,
  VehiclesService,
} from '../../services/vehicles.service';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from '../vehicle-list-item/vehicle-list-item.component';
import { RouterLink } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { debounceTime, Subscription } from 'rxjs';
import { SearchbarService } from '../../services/searchbar.service';

@Component({
  selector: 'app-vehicle-list',
  imports: [CommonModule, ListItemComponent, RouterLink],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css',
})
export class VehiclesListComponent implements OnChanges, OnDestroy {
  @Input() listings: VehicleListing[] = [];
  @Input() onDeleteCallback!: () => void;

  filteredListings: VehicleListing[] = [];
  private searchSubscription: Subscription | null = null;

  constructor(
    public vehiclesService: VehiclesService,
    private routingService: RoutingService,
    private searchbarService: SearchbarService
  ) {}

  ngOnInit() {
    location.pathname.includes('own-product')
      ? this.routingService.setPreviousRoute('own-product')
      : this.routingService.setPreviousRoute('vehicles');

    this.searchSubscription = this.searchbarService.searchQuery$
      .pipe(debounceTime(300)) // Wait 300ms after each keystroke
      .subscribe((query) => {
        this.filterListings(query);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['listings']) {
      // Update filtered listings whenever the listings input changes, nessecary due to reloads on the page
      this.filteredListings = [...this.listings];
    }
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  private filterListings(query: string): void {
    this.filteredListings = query
      ? this.listings.filter((listing) =>
          listing.name.toLowerCase().includes(query.toLowerCase())
        )
      : [...this.listings];
  }
}
