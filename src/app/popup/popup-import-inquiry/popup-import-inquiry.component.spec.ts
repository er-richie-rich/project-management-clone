import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupImportInquiryComponent } from './popup-import-inquiry.component';

describe('PopupImportInquiryComponent', () => {
  let component: PopupImportInquiryComponent;
  let fixture: ComponentFixture<PopupImportInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupImportInquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupImportInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
