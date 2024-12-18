import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailPageComponent } from './retail-page.component';

describe('RetailPageComponent', () => {
  let component: RetailPageComponent;
  let fixture: ComponentFixture<RetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
