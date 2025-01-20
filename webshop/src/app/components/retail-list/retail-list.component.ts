import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { RetailListing, RetailsService } from '../../services/retail.service';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from '../retail-list-item/retail-list-item.component';
import { RouterLink } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { debounceTime, Subscription } from 'rxjs';
import { SearchbarService } from '../../services/searchbar.service';

interface Category {
  category_id: number;
  name: string;
  parent_category_id?: number | null;
  additional_properties?: any;
  subcategories?: Category[];
}

@Component({
  selector: 'app-retail-list',
  imports: [CommonModule, ListItemComponent, RouterLink],
  templateUrl: './retail-list.component.html',
  styleUrl: './retail-list.component.css',
})
export class RetailListComponent implements OnChanges, OnDestroy {
  @Input() listings: RetailListing[] = [];
  @Input() onDeleteCallback!: () => void;
  @Input() onUpdateCallback!: () => void;
  @ViewChild('retailConditionSelect')
  retailConditionSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('retailDeliveryMethodSelect')
  retailDeliverySelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('minPrice')
  retailMinPrice!: ElementRef<HTMLSelectElement>;
  @ViewChild('maxPrice')
  retailMaxPrice!: ElementRef<HTMLSelectElement>;

  isFiltersOpen = false;
  filteredListings: RetailListing[] = [];
  retailConditions: { condition_id: number; condition_name: string }[] = [];
  retailDeliveryMethods: {
    delivery_method_id: number;
    delivery_method_name: string;
  }[] = [];

  categories: Category[] = [];
  currentSubcategories: Category[] | null = null;
  selectedCategory: Category | null = null;
  categoryDropdownOpen = false;

  additionalProperties: string[] = [];

  private searchSubscription: Subscription | null = null;

  // Filter criteria
  /*filterCriteria = {
    searchQuery: '',
    description: '',
    priceMin: 0,
    priceMax: Infinity,
    condition: '',
    deliveryMethod: '',
    category: '',
  };*/

  filterCriteria: {
    searchQuery: string | null;
    description: string | null;
    priceMin: number;
    priceMax: number;
    condition: string | null;
    deliveryMethod: string | null;
    category: string | null;
    additional_properties: { [key: string]: string | null };
  } = {
    searchQuery: null,
    description: null,
    priceMin: 0,
    priceMax: Infinity,
    condition: null,
    deliveryMethod: null,
    category: null,
    additional_properties: {},
  };

  constructor(
    public retailService: RetailsService,
    private routingService: RoutingService,
    private searchbarService: SearchbarService
  ) {}

  ngOnInit() {
    this.isFiltersOpen = location.pathname.includes('retail');
    this.loadRetailConditions(),
      this.loadRetailDeliveryMethods(),
      this.loadRetailCategories(),
      location.pathname.includes('own-product')
        ? this.routingService.setPreviousRoute('own-product')
        : this.routingService.setPreviousRoute('retail');

    this.searchSubscription = this.searchbarService.searchQuery$
      .pipe(debounceTime(300)) // Wait 300ms after each keystroke
      .subscribe((query) => {
        this.filterCriteria.searchQuery = query; // Search input
        this.applyFilters();
      });
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
    this.filterCriteria.category = category.name;
    this.categoryDropdownOpen = false;

    /*this.filterCriteria.additional_properties = {};
    this.additionalProperties = [];

    if (category.category_id) {
        this.realestateService.getAdditionalProperties(
            category.category_id
        );
    }
        */
  }

  showSubcategories(subcategories: Category[] | null) {
    this.currentSubcategories = subcategories;
  }

  toggleCategoryDropdown() {
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
  }

  clearCategorySelection() {
    this.selectedCategory = null;
    this.filterCriteria.category = null;
    this.categoryDropdownOpen = false;

    // Clear additional properties when category is cleared
    this.filterCriteria.additional_properties = {};
    this.additionalProperties = [];
  }

  clearFilters() {
    this.filterCriteria = {
      searchQuery: null,
      description: null,
      priceMin: 0,
      priceMax: Infinity,
      condition: null,
      deliveryMethod: null,
      category: null,
      additional_properties: {},
    };
    this.selectedCategory = null;
    this.additionalProperties = [];
    this.applyFilters();
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

  setCondition(condition: string): void {
    this.filterCriteria.condition = condition;
    this.applyFilters();
  }

  setDeliveryMethod(delivery_method: string): void {
    this.filterCriteria.deliveryMethod = delivery_method;
    this.applyFilters();
  }

  setPriceInterval(min: number, max: number): void {
    this.filterCriteria.priceMin = min;
    this.filterCriteria.priceMax = max;
    this.applyFilters();
  }

  applyFilter() {
    const selectedCondition = this.retailConditionSelect.nativeElement.value;
    const selectedDeliveryMethod =
      this.retailDeliverySelect.nativeElement.value;
    const minPrice = this.retailMinPrice.nativeElement.value;
    const maxPrice = this.retailMaxPrice.nativeElement.value;
    if (selectedCondition) {
      this.filterCriteria.condition = selectedCondition;
    }
    if (selectedDeliveryMethod) {
      this.filterCriteria.deliveryMethod = selectedDeliveryMethod;
    }
    if (minPrice) {
      this.filterCriteria.priceMin =
        Number(minPrice) > 0 ? Number(minPrice) : 0;
    }
    if (maxPrice) {
      this.filterCriteria.priceMax =
        Number(maxPrice) > Number(minPrice)
          ? Number(maxPrice)
          : Number(minPrice);
    }
    if (selectedCondition == '') {
      this.filterCriteria.condition = '';
    }
    if (selectedDeliveryMethod == '') {
      this.filterCriteria.deliveryMethod = '';
    }
    if (minPrice == '') {
      this.filterCriteria.priceMin = 0;
    }
    if (maxPrice == '') {
      this.filterCriteria.priceMax = Infinity;
    }
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredListings = this.listings.filter((listing) => {
      const matchesQuery =
        !this.filterCriteria.searchQuery ||
        listing.name
          .toLowerCase()
          .includes(this.filterCriteria.searchQuery.toLowerCase()) ||
        listing.description
          .toLowerCase()
          .includes(this.filterCriteria.searchQuery.toLowerCase());

      const matchesPrice =
        listing.price >= this.filterCriteria.priceMin &&
        listing.price <= this.filterCriteria.priceMax;
      const matchesCondtion =
        !this.filterCriteria.condition ||
        listing.condition_name
          .toLowerCase()
          .includes(this.filterCriteria.condition.toLowerCase());
      const matchesDeliveryMethod =
        !this.filterCriteria.deliveryMethod ||
        listing.delivery_method_name
          .toLowerCase()
          .includes(this.filterCriteria.deliveryMethod.toLowerCase());

      const matchesCategory =
        !this.filterCriteria.category ||
        listing.category
          .toLowerCase()
          .includes(this.filterCriteria.category.toLowerCase());

      console.log(listing.category);
      return (
        matchesQuery &&
        matchesPrice &&
        matchesCondtion &&
        matchesDeliveryMethod &&
        matchesCategory
      );
    });
  }

  loadRetailConditions(): void {
    this.retailService.getRetailConditions().subscribe({
      next: (data) => {
        this.retailConditions = data;
      },
      error: (error) => {
        console.error('Error loading retail Conditions:', error);
      },
    });
  }
  loadRetailDeliveryMethods(): void {
    this.retailService.getRetailDeliveryMethods().subscribe({
      next: (data) => {
        this.retailDeliveryMethods = data;
      },
      error: (error) => {
        console.error('Error loading retail delivery methods:', error);
      },
    });
  }
  loadRetailCategories(): void {
    this.retailService.getRetailCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading retail delivery methods:', error);
      },
    });
  }
}
