import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupConfirmDeleteComponent } from './popup-confirm-delete.component';

describe('PopupConfirmDeleteComponent', () => {
  let component: PopupConfirmDeleteComponent;
  let fixture: ComponentFixture<PopupConfirmDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupConfirmDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupConfirmDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
