import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyReportComponent } from './view-my-report.component';

describe('ViewMyReportComponent', () => {
  let component: ViewMyReportComponent;
  let fixture: ComponentFixture<ViewMyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMyReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
