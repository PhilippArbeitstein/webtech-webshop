import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCreateOverlayComponent } from './vehicle-create-overlay.component';

describe('VehicleCreateOverlayComponent', () => {
  let component: VehicleCreateOverlayComponent;
  let fixture: ComponentFixture<VehicleCreateOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleCreateOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleCreateOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
