import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnProductsPageComponent } from './own-products-page.component';

describe('OwnProductsPageComponent', () => {
  let component: OwnProductsPageComponent;
  let fixture: ComponentFixture<OwnProductsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnProductsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
