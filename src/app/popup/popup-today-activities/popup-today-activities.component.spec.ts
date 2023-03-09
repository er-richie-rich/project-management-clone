import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTodayActivitiesComponent } from './popup-today-activities.component';

describe('PopupTodayActivitiesComponent', () => {
  let component: PopupTodayActivitiesComponent;
  let fixture: ComponentFixture<PopupTodayActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupTodayActivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupTodayActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
