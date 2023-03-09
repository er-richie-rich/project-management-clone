import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTaskCardComponent } from './popup-task-card.component';

describe('PopupTaskCardComponent', () => {
  let component: PopupTaskCardComponent;
  let fixture: ComponentFixture<PopupTaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupTaskCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupTaskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
