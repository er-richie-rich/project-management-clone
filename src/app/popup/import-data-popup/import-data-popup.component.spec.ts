import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDataPopupComponent } from './import-data-popup.component';

describe('ImportDataPopupComponent', () => {
  let component: ImportDataPopupComponent;
  let fixture: ComponentFixture<ImportDataPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDataPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportDataPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
