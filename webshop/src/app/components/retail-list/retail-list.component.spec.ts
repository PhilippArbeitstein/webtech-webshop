import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailListComponent } from './retail-list.component';

describe('RetailListComponent', () => {
  let component: RetailListComponent;
  let fixture: ComponentFixture<RetailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetailListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
