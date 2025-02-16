import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailUpdateOverlayComponent } from './retail-update-overlay.component';

describe('RetailUpdateOverlayComponent', () => {
  let component: RetailUpdateOverlayComponent;
  let fixture: ComponentFixture<RetailUpdateOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetailUpdateOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailUpdateOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
