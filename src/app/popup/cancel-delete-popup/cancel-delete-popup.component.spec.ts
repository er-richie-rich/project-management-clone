import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelDeletePopupComponent } from './cancel-delete-popup.component';

describe('CancelDeletePopupComponent', () => {
  let component: CancelDeletePopupComponent;
  let fixture: ComponentFixture<CancelDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelDeletePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
