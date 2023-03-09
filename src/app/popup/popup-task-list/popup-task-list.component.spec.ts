import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTaskListComponent } from './popup-task-list.component';

describe('PopupTaskListComponent', () => {
  let component: PopupTaskListComponent;
  let fixture: ComponentFixture<PopupTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupTaskListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
