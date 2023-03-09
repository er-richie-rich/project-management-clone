import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupHrPolicyComponent } from './popup-hr-policy.component';

describe('PopupHrPolicyComponent', () => {
  let component: PopupHrPolicyComponent;
  let fixture: ComponentFixture<PopupHrPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupHrPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupHrPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
