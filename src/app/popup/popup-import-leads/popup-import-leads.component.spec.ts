import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupImportLeadsComponent } from './popup-import-leads.component';

describe('PopupImportLeadsComponent', () => {
  let component: PopupImportLeadsComponent;
  let fixture: ComponentFixture<PopupImportLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupImportLeadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupImportLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
