import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentManagementDetailComponent } from './department-management-detail.component';

describe('DepartmentManagementDetailComponent', () => {
  let component: DepartmentManagementDetailComponent;
  let fixture: ComponentFixture<DepartmentManagementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentManagementDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
