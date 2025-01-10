import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealestateDetailedFilterComponent } from './realestate-detailed-filter.component';

describe('RealestateDetailedFilterComponent', () => {
  let component: RealestateDetailedFilterComponent;
  let fixture: ComponentFixture<RealestateDetailedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealestateDetailedFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealestateDetailedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
