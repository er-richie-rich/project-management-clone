import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAddReportInventoryComponent } from './popup-add-report-inventory.component';

describe('PopupAddReportInventoryComponent', () => {
  let component: PopupAddReportInventoryComponent;
  let fixture: ComponentFixture<PopupAddReportInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupAddReportInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupAddReportInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
