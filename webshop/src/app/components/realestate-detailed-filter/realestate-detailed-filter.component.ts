import { Component, OnInit } from '@angular/core';
import { RealestateService } from '../../services/realestate.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
    category_id: number;
    name: string;
    parent_category_id?: number | null;
    additional_properties?: any;
    subcategories?: Category[];
}

@Component({
    selector: 'app-realestate-detailed-filter',
    imports: [CommonModule, FormsModule],
    templateUrl: './realestate-detailed-filter.component.html',
    styleUrls: ['./realestate-detailed-filter.component.css']
})
export class RealestateDetailedFilterComponent implements OnInit {
    categories: Category[] = [];
    currentSubcategories: Category[] | null = null;
    selectedCategory: Category | null = null;

    categoryDropdownOpen = false;
    additionalPropertiesCollapsed = true;
    filterCollapsed = false;

    additionalProperties: string[] = [];

    filters: {
        category_id: number | null;
        min_price: number | null;
        max_price: number | null;
        rent_start: string | null;
        rent_end: string | null;
        province: string;
        city: string;
        available_now: boolean;
        additional_properties: { [key: string]: string | null };
    } = {
        category_id: null,
        min_price: null,
        max_price: null,
        rent_start: null,
        rent_end: null,
        province: '',
        city: '',
        available_now: false,
        additional_properties: {}
    };

    constructor(private realestateService: RealestateService) {}

    ngOnInit() {
        this.realestateService.categories$.subscribe(
            (allCategories: Category[]) => {
                const realEstateCategory = allCategories.find(
                    (category) => category.name === 'Real Estate'
                );
                this.categories = realEstateCategory?.subcategories || [];
            }
        );

        this.realestateService.additionalProperties$.subscribe((properties) => {
            this.additionalProperties = properties;
        });
    }

    toggleCategoryDropdown() {
        this.categoryDropdownOpen = !this.categoryDropdownOpen;
    }

    showSubcategories(subcategories: Category[] | null) {
        this.currentSubcategories = subcategories;
    }

    selectCategory(category: Category) {
        this.selectedCategory = category;
        this.filters.category_id = category.category_id;
        this.categoryDropdownOpen = false;

        this.filters.additional_properties = {};
        this.additionalProperties = [];

        if (category.category_id) {
            this.realestateService.getAdditionalProperties(
                category.category_id
            );
        }
    }

    applyFilters() {
        this.realestateService.filterListings(this.filters);
    }

    toggleFilterCollapse() {
        this.filterCollapsed = !this.filterCollapsed;
    }

    clearCategorySelection() {
        this.selectedCategory = null;
        this.filters.category_id = null;
        this.categoryDropdownOpen = false;

        // Clear additional properties when category is cleared
        this.filters.additional_properties = {};
        this.additionalProperties = [];
    }

    clearFilters() {
        this.filters = {
            category_id: null,
            min_price: null,
            max_price: null,
            rent_start: null,
            rent_end: null,
            province: '',
            city: '',
            available_now: false,
            additional_properties: {}
        };
        this.selectedCategory = null;
        this.additionalProperties = [];
        this.applyFilters();
    }

    toggleAdditionalPropertiesCollapse() {
        this.additionalPropertiesCollapsed =
            !this.additionalPropertiesCollapsed;
    }

    collapseFilterOnScroll(): void {
        this.filterCollapsed = true;
    }
}
