import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupImportUserComponent } from './popup-import-user.component';

describe('PopupImportUserComponent', () => {
  let component: PopupImportUserComponent;
  let fixture: ComponentFixture<PopupImportUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupImportUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupImportUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
