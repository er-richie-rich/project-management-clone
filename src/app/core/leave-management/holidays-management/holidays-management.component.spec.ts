import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaysManagementComponent } from './holidays-management.component';

describe('HolidaysManagementComponent', () => {
  let component: HolidaysManagementComponent;
  let fixture: ComponentFixture<HolidaysManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidaysManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidaysManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
