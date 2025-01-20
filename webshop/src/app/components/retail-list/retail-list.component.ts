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
  parent_category: Category | null;
  additional_properties?: any;
  subcategories?: Category[];
  isHovered: boolean;
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
  categoryTree: Category[] = [];
  currentSubcategories: Category[] | null = null;
  selectedCategory: Category | null = null;
  categoryDropdownOpen = false;

  additionalProperties: string[] = [];

  private searchSubscription: Subscription | null = null;

  filterCriteria: {
    searchQuery: string | null;
    description: string | null;
    priceMin: number;
    priceMax: number;
    condition: string | null;
    deliveryMethod: string | null;
    category: string;
    additional_properties: { [key: string]: string | null };
  } = {
    searchQuery: null,
    description: null,
    priceMin: 0,
    priceMax: Infinity,
    condition: null,
    deliveryMethod: null,
    category: '',
    additional_properties: {},
  };

  constructor(
    public retailService: RetailsService,
    private routingService: RoutingService,
    private searchbarService: SearchbarService
  ) {}

  ngOnInit() {
    this.isFiltersOpen = location.pathname.includes('retail');
    this.loadRetailConditions();
    this.loadRetailDeliveryMethods();
    this.loadRetailCategories();

    this.searchSubscription = this.searchbarService.searchQuery$
      .pipe(debounceTime(300))
      .subscribe((query) => {
        this.filterCriteria.searchQuery = query;
        this.applyFilters();
      });
  }

  selectCategory(category: Category) {
    console.log(this.categoryTree);
    this.selectedCategory = category || null;
    this.filterCriteria.category = category.name;
    this.categoryDropdownOpen = false;

    // Reset additional properties if applicable
    this.filterCriteria.additional_properties = {};
    this.additionalProperties = [];
  }

  showSubcategories(category: Category) {
    this.currentSubcategories = category?.subcategories || [];
  }

  toggleCategoryDropdown() {
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
  }

  clearCategorySelection() {
    this.selectedCategory = null;
    this.filterCriteria.category = '';
    this.categoryDropdownOpen = false;

    // Clear additional properties
    this.filterCriteria.additional_properties = {};
    this.additionalProperties = [];

    this.loadRetailCategories();
  }

  clearFilters() {
    this.filterCriteria = {
      searchQuery: null,
      description: null,
      priceMin: 0,
      priceMax: Infinity,
      condition: null,
      deliveryMethod: null,
      category: '',
      additional_properties: {},
    };
    this.selectedCategory = null;
    this.additionalProperties = [];
    this.loadRetailCategories();
    this.applyFilters();
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

  applyFilter() {
    const selectedCondition = this.retailConditionSelect.nativeElement.value;
    const selectedDeliveryMethod =
      this.retailDeliverySelect.nativeElement.value;
    const minPrice = this.retailMinPrice.nativeElement.value;
    const maxPrice = this.retailMaxPrice.nativeElement.value;

    this.filterCriteria.condition = selectedCondition || null;
    this.filterCriteria.deliveryMethod = selectedDeliveryMethod || null;
    this.filterCriteria.priceMin = minPrice ? Number(minPrice) : 0;
    this.filterCriteria.priceMax = maxPrice ? Number(maxPrice) : Infinity;

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
      const matchesCondition =
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

      return (
        matchesQuery &&
        matchesPrice &&
        matchesCondition &&
        matchesDeliveryMethod &&
        matchesCategory
      );
    });
  }

  private buildCategoryTree(categories: Category[]): Category[] {
    const categoryMap = new Map<number, Category>();

    categories.forEach((category) => {
      categoryMap.set(category.category_id, {
        ...category,
        subcategories: [],
        isHovered: false,
      });
    });

    const tree: Category[] = [];

    categories.forEach((category) => {
      if (category.parent_category_id === null) {
        tree.push(categoryMap.get(category.category_id)!);
      } else {
        const parent =
          category.parent_category_id !== undefined
            ? categoryMap.get(category.parent_category_id)
            : undefined;
        if (parent) {
          category.parent_category = parent;
          parent.subcategories!.push(categoryMap.get(category.category_id)!);
        }
      }
    });

    return tree;
  }

  loadRetailCategories(): void {
    this.retailService.getRetailCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.categoryTree = this.buildCategoryTree(data);
        console.log(this.categoryTree);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }
  loadRetailConditions(): void {
    this.retailService.getRetailConditions().subscribe({
      next: (data) => {
        this.retailConditions = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }
  loadRetailDeliveryMethods(): void {
    this.retailService.getRetailDeliveryMethods().subscribe({
      next: (data) => {
        this.retailDeliveryMethods = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  keepDropdownOpen() {
    this.categoryDropdownOpen = true;
  }

  closeDropdown() {
    this.categoryDropdownOpen = false;
  }
}
