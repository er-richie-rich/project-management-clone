import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAddLeaveComponent } from './popup-add-leave.component';

describe('PopupAddLeaveComponent', () => {
  let component: PopupAddLeaveComponent;
  let fixture: ComponentFixture<PopupAddLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupAddLeaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupAddLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
