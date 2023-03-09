import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReportManagementComponent } from './inventory-report-management.component';

describe('InventoryReportManagementComponent', () => {
  let component: InventoryReportManagementComponent;
  let fixture: ComponentFixture<InventoryReportManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryReportManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryReportManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
