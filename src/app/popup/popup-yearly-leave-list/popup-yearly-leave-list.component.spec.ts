import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupYearlyLeaveListComponent } from './popup-yearly-leave-list.component';

describe('PopupYearlyLeaveListComponent', () => {
  let component: PopupYearlyLeaveListComponent;
  let fixture: ComponentFixture<PopupYearlyLeaveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupYearlyLeaveListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupYearlyLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
