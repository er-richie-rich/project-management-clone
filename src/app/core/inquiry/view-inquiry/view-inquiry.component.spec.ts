import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInquiryComponent } from './view-inquiry.component';

describe('ViewInquiryComponent', () => {
  let component: ViewInquiryComponent;
  let fixture: ComponentFixture<ViewInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewInquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
