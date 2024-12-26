import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealestateCreateOverlayComponent } from './realestate-create-overlay.component';

describe('RealestateCreateOverlayComponent', () => {
  let component: RealestateCreateOverlayComponent;
  let fixture: ComponentFixture<RealestateCreateOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealestateCreateOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealestateCreateOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
