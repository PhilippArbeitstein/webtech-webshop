import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    OnDestroy,
    HostListener,
    Output,
    EventEmitter
} from '@angular/core';
import {
    RealEstateListing,
    RealestateService
} from '../../services/realestate.service';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from '../list-item/list-item.component';
import { RouterLink } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { debounceTime, Subscription } from 'rxjs';
import { SearchbarService } from '../../services/searchbar.service';

@Component({
    selector: 'app-realestate-list',
    imports: [CommonModule, ListItemComponent, RouterLink],
    templateUrl: './realestate-list.component.html',
    styleUrl: './realestate-list.component.css'
})
export class RealestateListComponent implements OnChanges, OnDestroy {
    @Input() listings: RealEstateListing[] = [];
    @Input() onDeleteCallback!: () => void;
    @Output() scrollEvent = new EventEmitter<void>();

    filteredListings: RealEstateListing[] = [];
    private searchSubscription: Subscription | null = null;

    constructor(
        public realestateService: RealestateService,
        private routingService: RoutingService,
        private searchbarService: SearchbarService
    ) {}

    ngOnInit() {
        location.pathname.includes('own-product')
            ? this.routingService.setPreviousRoute('own-product')
            : this.routingService.setPreviousRoute('real-estate');

        this.searchSubscription = this.searchbarService.searchQuery$
            .pipe(debounceTime(300))
            .subscribe((query) => {
                this.filterListings(query);
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['listings']) {
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

    @HostListener('scroll', ['$event'])
    onScroll(event: Event) {
        const target = event.target as HTMLElement;

        console.log('SCROLL');

        if (target.scrollTop > 0) {
            this.scrollEvent.emit();
        }
    }
}
