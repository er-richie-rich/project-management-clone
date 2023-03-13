import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagementDashboardComponent } from './project-management-dashboard.component';

describe('ProjectManagementDashboardComponent', () => {
  let component: ProjectManagementDashboardComponent;
  let fixture: ComponentFixture<ProjectManagementDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectManagementDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
