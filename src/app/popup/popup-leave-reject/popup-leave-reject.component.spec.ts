import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupLeaveRejectComponent } from './popup-leave-reject.component';

describe('PopupLeaveRejectComponent', () => {
  let component: PopupLeaveRejectComponent;
  let fixture: ComponentFixture<PopupLeaveRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupLeaveRejectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupLeaveRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
