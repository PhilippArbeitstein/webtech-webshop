import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailDetailsComponent } from './retail-details.component';

describe('RetailDetailsComponent', () => {
  let component: RetailDetailsComponent;
  let fixture: ComponentFixture<RetailDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetailDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
