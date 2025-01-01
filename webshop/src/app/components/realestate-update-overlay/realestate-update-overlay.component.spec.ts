import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealestateUpdateOverlayComponent } from './realestate-update-overlay.component';

describe('RealestateUpdateOverlayComponent', () => {
  let component: RealestateUpdateOverlayComponent;
  let fixture: ComponentFixture<RealestateUpdateOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealestateUpdateOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealestateUpdateOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
