import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailCreateOverlayComponent } from './retail-create-overlay.component';

describe('RetailCreateOverlayComponent', () => {
  let component: RetailCreateOverlayComponent;
  let fixture: ComponentFixture<RetailCreateOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetailCreateOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailCreateOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
