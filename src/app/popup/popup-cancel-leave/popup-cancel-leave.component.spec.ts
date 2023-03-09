import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCancelLeaveComponent } from './popup-cancel-leave.component';

describe('PopupCancelLeaveComponent', () => {
  let component: PopupCancelLeaveComponent;
  let fixture: ComponentFixture<PopupCancelLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupCancelLeaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCancelLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
