import { Component, EventEmitter, Output } from '@angular/core';
import { RetailsService } from '../../services/retail.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface NewRetailListing {
  image_url: string;
  name: string;
  description: string;
  price: number;
  additional_properties: {
    [key: string]: string | number | boolean;
  };
  color: string;
  condition: string;
  delivery_method: string;
  categories: number;
}
interface Category {
  category_id: number;
  name: string;
  parent_category_id?: number | null;
  parent_category: Category | null;
  additional_properties?: any;
  subcategories?: Category[];
}

@Component({
  selector: 'app-retail-create-overlay',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './retail-create-overlay.component.html',
  styleUrls: ['./retail-create-overlay.component.css'],
})
export class RetailCreateOverlayComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  RetailForm: FormGroup;
  RetailConditions: { condition_id: number; condition_name: string }[] = [];
  RetailDeliveryMethods: {
    delivery_method_id: number;
    delivery_method_name: string;
  }[] = [];
  categories: Category[] = [];
  constructor(private fb: FormBuilder, private RetailsService: RetailsService) {
    // Initialize the form using FormBuilder
    this.RetailForm = this.fb.group({
      image_url: [
        '',
        [Validators.required, Validators.pattern('(http|https)://.+')],
      ],
      name: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      additional_properties: this.fb.array([]),
      condition: ['', Validators.required],
      delivery_method: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRetailConditions();
    this.loadRetailDeliveryMethods();
    this.loadRetailCategories();
  }

  loadRetailConditions(): void {
    this.RetailsService.getRetailConditions().subscribe({
      next: (data) => {
        this.RetailConditions = data;
      },
      error: (error) => {
        console.error('Error loading retail Conditions:', error);
      },
    });
  }

  loadRetailDeliveryMethods(): void {
    this.RetailsService.getRetailDeliveryMethods().subscribe({
      next: (data) => {
        this.RetailDeliveryMethods = data;
      },
      error: (error) => {
        console.error('Error loading retail delivery methods:', error);
      },
    });
  }

  loadRetailCategories(): void {
    this.RetailsService.getRetailCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.destroyCategoryTree();
        this.removeParentCategories();
      },
      error: (error) => {
        console.error('Error loading retail categories:', error);
      },
    });
  }

  destroyCategoryTree(): void {
    const flatCategories: Category[] = [];

    const flatten = (categories: Category[]) => {
      for (const category of categories) {
        flatCategories.push({ ...category, subcategories: [] }); // Store the category without children
        if ((category as any).children?.length) {
          flatten((category as any).children); // Recursively flatten children
        }
      }
    };

    flatten(this.categories); // Start flattening from the root categories
    this.categories = flatCategories; // Assign the flattened list
  }

  removeParentCategories(): void {
    const parentCategoryIds = new Set(
      this.categories
        .filter((cat) =>
          this.categories.some(
            (subCat) => subCat.parent_category_id === cat.category_id
          )
        )
        .map((cat) => cat.category_id)
    );

    this.categories = this.categories.filter(
      (cat) => !parentCategoryIds.has(cat.category_id)
    );
  }

  selectedCategory: number | null = null;

  selectCategory(category: Category): void {
    this.selectedCategory = category.category_id;
    console.log('Selected Category:', this.selectedCategory);
  }

  get additionalProperties(): FormArray {
    return this.RetailForm.get('additional_properties') as FormArray;
  }

  addProperty(): void {
    const propertyGroup = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    });
    this.additionalProperties.push(propertyGroup);
  }

  removeProperty(index: number): void {
    this.additionalProperties.removeAt(index);
  }

  onCreate(): void {
    if (this.RetailForm.invalid) {
      this.markFormGroupTouched(this.RetailForm);
      return;
    }

    const additionalPropsArray = this.RetailForm.get(
      'additional_properties'
    )?.value;
    const additionalPropsObj: { [key: string]: string } = {};
    additionalPropsArray.forEach((item: any) => {
      if (item.key && item.value) {
        additionalPropsObj[item.key] = item.value;
      }
    });

    const newListing: NewRetailListing = {
      ...this.RetailForm.value,
      status: 'Available',
      additional_properties: additionalPropsObj,
    };

    this.RetailsService.createListing(newListing).subscribe({
      next: (response) => {
        alert(response);
        this.created.emit();
        this.onClose();
      },
      error: (error) => {
        console.error('Error creating listing:', error);
        alert('Eintrag konnte nicht erstellt werden. Versuche es erneut.');
      },
    });
  }

  onClose(): void {
    this.close.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
