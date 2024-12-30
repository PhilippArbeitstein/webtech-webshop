import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailListItemComponent } from './retail-list-item.component';

describe('RetailListItemComponent', () => {
  let component: RetailListItemComponent;
  let fixture: ComponentFixture<RetailListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetailListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
