import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
  ElementRef,
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
  @ViewChild('fuelTypeSelect') fuelTypeSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('vehicleConditionSelect')
  vehicleConditionSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('vehicleMarkSelect')
  vehicleMarkSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('vehicleTypeSelect')
  vehicleTypeSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('minPrice')
  vehicleMinPrice!: ElementRef<HTMLSelectElement>;
  @ViewChild('maxPrice')
  vehicleMaxPrice!: ElementRef<HTMLSelectElement>;
  @ViewChild('maxMileage')
  vehicleMaxMileage!: ElementRef<HTMLSelectElement>;
  @ViewChild('minMileage')
  vehicleMinMileage!: ElementRef<HTMLSelectElement>;

  filteredListings: VehicleListing[] = [];
  private searchSubscription: Subscription | null = null;

  vehicleTypes: { type_id: number; type_name: string }[] = [];
  vehicleMarks: { mark_id: number; mark_name: string }[] = [];
  vehicleFuelTypes: { fuel_type_id: number; fuel_type_name: string }[] = [];
  vehicleConditions: { condition_id: number; condition_name: string }[] = [];

  // Filter criteria
  filterCriteria = {
    searchQuery: '',
    description: '',
    mark: '',
    model: '',
    type: '',
    priceMin: 0,
    priceMax: Infinity,
    condition: '',
    fuel_type: '',
    mileageMin: 0,
    mileageMax: Infinity,
  };

  constructor(
    public vehicleService: VehiclesService,
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
        this.filterCriteria.searchQuery = query; // Search input
        this.applyFilters();
      });

    this.loadVehicleConditions();
    this.loadVehicleFuelTypes();
    this.loadVehicleMarks();
    this.loadVehicleTypes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['listings']) {
      // Update filtered listings whenever the listings input changes, necessary due to reloads on the page
      this.filteredListings = [...this.listings];
    }
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  setMark(mark: string): void {
    this.filterCriteria.mark = mark;
    this.applyFilters();
  }

  setType(type: string): void {
    this.filterCriteria.type = type;
    this.applyFilters();
  }

  setPriceInterval(min: number, max: number): void {
    this.filterCriteria.priceMin = min;
    this.filterCriteria.priceMax = max;
    this.applyFilters();
  }
  applyFilter() {
    const selectedFuelType = this.fuelTypeSelect.nativeElement.value;
    const selectedMark = this.vehicleMarkSelect.nativeElement.value;
    const selectedType = this.vehicleTypeSelect.nativeElement.value;
    const selectedCondition = this.vehicleConditionSelect.nativeElement.value;
    const minPrice = this.vehicleMinPrice.nativeElement.value;
    const maxPrice = this.vehicleMaxPrice.nativeElement.value;
    const minMileage = this.vehicleMinMileage.nativeElement.value;
    const maxMileage = this.vehicleMaxMileage.nativeElement.value;
    if (selectedFuelType) {
      this.filterCriteria.fuel_type = selectedFuelType;
    }
    if (selectedMark) {
      this.filterCriteria.mark = selectedMark;
    }
    if (selectedType) {
      this.filterCriteria.type = selectedType;
    }
    if (selectedCondition) {
      this.filterCriteria.condition = selectedCondition;
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
    if (minMileage) {
      this.filterCriteria.mileageMin =
        Number(minMileage) > 0 ? Number(minMileage) : 0;
    }
    if (maxMileage) {
      this.filterCriteria.mileageMax =
        Number(maxMileage) > Number(minMileage)
          ? Number(maxMileage)
          : Number(minMileage);
    }
    if (selectedFuelType == '') {
      this.filterCriteria.fuel_type = '';
    }
    if (selectedMark == '') {
      this.filterCriteria.mark = '';
    }
    if (selectedType == '') {
      this.filterCriteria.type = '';
    }
    if (selectedCondition == '') {
      this.filterCriteria.condition = '';
    }
    if (minPrice == '') {
      this.filterCriteria.priceMin = 0;
    }
    if (maxPrice == '') {
      this.filterCriteria.priceMax = Infinity;
    }
    if (minMileage == '') {
      this.filterCriteria.mileageMin = 0;
    }
    if (maxMileage == '') {
      this.filterCriteria.mileageMax = Infinity;
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
          .includes(this.filterCriteria.searchQuery.toLowerCase()) ||
        listing.type_name
          .toLowerCase()
          .includes(this.filterCriteria.searchQuery.toLowerCase()) ||
        listing.color
          .toLowerCase()
          .includes(this.filterCriteria.searchQuery.toLowerCase());

      const matchesMark =
        !this.filterCriteria.mark ||
        listing.mark_name
          .toLowerCase()
          .includes(this.filterCriteria.mark.toLowerCase());
      const matchesModel =
        !this.filterCriteria.model ||
        listing.model_name
          .toLowerCase()
          .includes(this.filterCriteria.model.toLowerCase());
      const matchesType =
        !this.filterCriteria.type ||
        listing.type_name
          .toLowerCase()
          .includes(this.filterCriteria.type.toLowerCase());
      const matchesPrice =
        listing.price >= this.filterCriteria.priceMin &&
        listing.price <= this.filterCriteria.priceMax;
      const matchesMileage =
        listing.mileage >= this.filterCriteria.mileageMin &&
        listing.mileage <= this.filterCriteria.mileageMax;
      const matchesCondtion =
        !this.filterCriteria.condition ||
        listing.condition_name
          .toLowerCase()
          .includes(this.filterCriteria.condition.toLowerCase());
      const matchesFuelType =
        !this.filterCriteria.fuel_type ||
        listing.fuel_type_name
          .toLowerCase()
          .includes(this.filterCriteria.fuel_type.toLowerCase());
      return (
        matchesQuery &&
        matchesMark &&
        matchesModel &&
        matchesType &&
        matchesPrice &&
        matchesCondtion &&
        matchesFuelType &&
        matchesMileage
      );
    });
  }

  loadVehicleTypes(): void {
    this.vehicleService.getVehicleTypes().subscribe({
      next: (data) => {
        this.vehicleTypes = data;
      },
      error: (error) => {
        console.error('Error loading vehicle types:', error);
      },
    });
  }
  loadVehicleMarks(): void {
    this.vehicleService.getVehicleMarks().subscribe({
      next: (data) => {
        this.vehicleMarks = data;
      },
      error: (error) => {
        console.error('Error loading vehicle Marks:', error);
      },
    });
  }
  loadVehicleFuelTypes(): void {
    this.vehicleService.getVehicleFuelTypes().subscribe({
      next: (data) => {
        this.vehicleFuelTypes = data;
      },
      error: (error) => {
        console.error('Error loading vehicle Fuel Types:', error);
      },
    });
  }
  loadVehicleConditions(): void {
    this.vehicleService.getVehicleConditions().subscribe({
      next: (data) => {
        this.vehicleConditions = data;
      },
      error: (error) => {
        console.error('Error loading vehicle Marks:', error);
      },
    });
  }
}
