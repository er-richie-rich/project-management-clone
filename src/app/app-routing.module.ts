import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginLayoutComponent} from './layout/login-layout/login-layout.component';
import {HomelayoutComponent} from './layout/home-layout/homelayout.component';
import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {ChangePasswordComponent} from './my-account/change-password/change-password.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuardService} from 'src/services/auth-guard.service';
import {ProjectManagementComponent} from './project-management/project-management.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {AddEditProjectComponent} from './project-management/add-edit-project/add-edit-project.component';
import {MyProfileComponent} from './my-account/my-profile/my-profile.component';
import {AddFileComponent} from './project-management/project-details/files-manage/add-file/add-file.component';
import {AddEditUserComponent} from './user-management/add-edit-user/add-edit-user.component';
import {AddMilestoneComponent} from './project-management/project-details/project-data/add-milestone/add-milestone.component';
import {AddChangeRequestComponent} from './project-management/project-details/change-request/add-change-request/add-change-request.component';
import {ChangeRequestComponent} from './project-management/project-details/change-request/change-request.component';
import {TaskManageComponent} from './project-management/project-details/task-manage/task-manage.component';
import {FilesManageComponent} from './project-management/project-details/files-manage/files-manage.component';
import {LeaveManagementComponent} from './leave-management/leave-management.component';
import {UserChangePasswordComponent} from './user-management/user-change-password/change-password.component';
import {ProjectDataComponent} from './project-management/project-details/project-data/project-data.component';
import {ImportantDocumentComponent} from './important-document/important-document.component';
import {DashboardHrComponent} from './dashboard/hr-dashboard/dashboard-hr.component';
import {ProjectManagementDashboardComponent} from './dashboard/project-management-dashboard/project-management-dashboard.component';
import {EmployeeManagementComponent} from './employee-management/employee-management.component';
import {AddEditEmployeeComponent} from './employee-management/add-edit-employee/add-edit-employee.component';
import {EmployeeManagementDetailComponent} from './employee-management/employee-management-detail/employee-management-detail.component';
import {ApplyLeaveComponent} from './leave-management/apply-leave/apply-leave.component';
import {DocumentManagementComponent} from './document-management/document-management.component';
import {AddEditDocumentManagementComponent} from './document-management/add-edit-document-management/add-edit-document-management.component';
import {AnnouncementComponent} from './announcement/announcement.component';
import {MyLeavesComponent} from './leave-management/my-leaves/my-leaves.component';
import {SalesManagementComponent} from "./sales-management/sales-management.component";
import {InquiryComponent} from "./inquiry/inquiry.component";
import {SalesDashboardComponent} from "./dashboard/sales-dashboard/sales-dashboard.component";
import {AddNewLeadComponent} from "./sales-management/add-new-lead/add-new-lead.component";
import {CareerComponent} from "./career/career.component";
import {ViewLeadComponent} from "./sales-management/view-lead/view-lead.component";
import {ViewInquiryComponent} from "./inquiry/view-inquiry/view-inquiry.component";
import {ViewCandidateComponent} from "./career/view-candidate/view-candidate.component";
import {ViewUserComponent} from "./user-management/view-user/view-user.component";
import {InventoryManagementComponent} from "./inventory-management/inventory-management.component";
import {DepartmentManagementComponent} from "./department-management/department-management.component";
import {AddEditDepartmentComponent} from "./department-management/add-edit-department/add-edit-department.component";
import {AddEditInventoryComponent} from "./inventory-management/add-edit-inventory/add-edit-inventory.component";
import {InventoryManagementDetailComponent} from "./inventory-management/inventory-management-detail/inventory-management-detail.component";
import {DepartmentManagementDetailComponent} from "./department-management/department-management-detail/department-management-detail.component";
import {TicketManagementComponent} from "./ticket-management/ticket-management.component";
import {AddEditTicketComponent} from "./ticket-management/add-edit-ticket/add-edit-ticket.component";
import {TicketDetailsComponent} from "./ticket-management/ticket-details/ticket-details.component";
import {LeaveDetailComponent} from "./leave-management/leave-detail/leave-detail.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {HolidaysManagementComponent} from "./leave-management/holidays-management/holidays-management.component";
import {AddEditHolidaysComponent} from "./leave-management/holidays-management/add-edit-holidays/add-edit-holidays.component";
// import {InventoryReportManagementComponent} from "./inventory-report-management/inventory-report-management.component";
// import {ViewMyReportComponent} from "./inventory-report-management/view-my-report/view-my-report.component";

const routes: Routes = [

    {
        path: '',
        component: LoginLayoutComponent,
        children: [
            {path: '', redirectTo: 'login', pathMatch: 'full'},
            {path: 'login', component: LoginComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'reset-password/:token', component: ResetPasswordComponent},
        ]
    },
    {
        path: '',
        component: HomelayoutComponent,
        //canActivate: [AuthGuardService],
        children: [
            //HR MANAGERS
            {path: 'hr-dashboard', component: DashboardHrComponent, data: {title: 'HR Dashboard'}},
            {path: 'employee-management', component: EmployeeManagementComponent, data: {title: 'Employee Management'}},
            {
                path: 'employee-management/add-edit-employee/:id',
                component: AddEditEmployeeComponent,
                data: {title: 'Employee Management'}
            },
            {
                path: 'employee-management/employee-detail/:id',
                component: EmployeeManagementDetailComponent,
                data: {title: 'Employee Management'}
            },
            {path: 'document-management', component: DocumentManagementComponent, data: {title: 'Document Management'}},
            {
                path: 'document-management/add-edit-document/:id',
                component: AddEditDocumentManagementComponent,
                data: {title: 'Document Management'}
            },
            {path: 'announcement', component: AnnouncementComponent, data: {title: 'Announcement'}},
            //  HRMANAGERS AND SUPERADMINS
            {path: 'leave-management', component: LeaveManagementComponent, data: {title: 'Leave Management'}},
            {path: 'leave-management/my-leave/apply-leave', component: ApplyLeaveComponent, data: {title: 'Leave Management'}},
            {path: 'leave-management/my-leave', component: MyLeavesComponent, data: {title: 'Leave Management'}},
            {path: 'leave-management/my-leave/leave-detail/:id', component: LeaveDetailComponent, data: {title: 'Leave Management'}},
            {path: 'holidays-management', component: HolidaysManagementComponent, data: {title: 'Holidays'}},
            {
                path: 'holidays-management/add-edit-holidays/:id',
                component: AddEditHolidaysComponent,
                data: {title: 'Holidays Management'}
            },

            // !HR
            {path: 'dashboard', component: DashboardComponent, data: {title: 'Dashboard'}},
            {path: 'important-document', component: ImportantDocumentComponent, data: {title: 'Important Document'}},
            {path: 'ticket-management', component: TicketManagementComponent, data: {title: 'Ticket Management'}},
            {path: 'ticket-management/add-edit-ticket/:id', component: AddEditTicketComponent, data: {title: 'Ticket Management'}},
            {path: 'ticket-management/ticket-details/:id', component: TicketDetailsComponent, data: {title: 'Ticket Management'}},

            //  SUPERADMINS AND PROJECTMANAGERS
            {path: 'project-management', component: ProjectManagementComponent, data: {title: 'Project Management'}},
            {
                path: 'project-management/add-edit-project',
                component: AddEditProjectComponent,
                data: {title: 'Project Management'}
            },
            {
                path: 'project-management/add-edit-project/:id',
                component: AddEditProjectComponent,
                data: {title: 'Project Management'}
            },
            {
                path: 'project-management/project-details/project-data/:id',
                component: ProjectDataComponent,
                data: {title: 'Project Management'}
            },
            {
                path: 'project-management/project-details/project-data',
                component: ProjectDataComponent,
                data: {title: 'Project Management'}
            },
            {
                path: 'project-management/project-details/change-request/:id',
                component: ChangeRequestComponent,
                data: {title: 'Project Management'}
            },
            {
                path: 'project-management/project-details/task-manage/:id',
                component: TaskManageComponent,
                data: {title: 'Project Management'}
            },
            {
                path: 'project-management/project-details/files-manage/:id',
                component: FilesManageComponent,
                data: {title: 'Project Management'}
            },
            {
                path: 'project-management/project-details/add-file/:id/:projectFileId',
                component: AddFileComponent,
                data: {title: 'Project Management'}
            },
            {
                path: 'project-management/project-details/add-milestone/:id/:editmilestoneId',
                component: AddMilestoneComponent,
                data: {title: 'Project Management'}
            },
            {
                path: 'project-management/project-details/add-change-request/:id/:requestId',
                component: AddChangeRequestComponent,
                data: {title: 'Project Management'}
            },
            // SUPERADMINS AND NETWORKENGINEER
            {path: 'inventory-management', component: InventoryManagementComponent, data: {title: 'Inventory Management'}},
            {
                path: 'inventory-management/add-edit-inventory/:id',
                component: AddEditInventoryComponent,
                data: {title: 'Inventory Management'}
            },
            {
                path: 'inventory-management/inventory-detail/:id',
                component: InventoryManagementDetailComponent,
                data: {title: 'Inventory Management'}
            },

            // {path: 'inventory-report-management', component: InventoryReportManagementComponent, data: {title: 'Report Inventory Management'}},
            // {path: 'inventory-report-management/my-report', component: ViewMyReportComponent, data: {title: 'Report Inventory Management'}},

            //  SUPERADMINS
            {path: 'department-management',component: DepartmentManagementComponent , data: {title: 'Department Management'}},
            {
                path: 'department-management/add-edit-department/:id',
                component: AddEditDepartmentComponent,
                data: {title: 'Department Management'}
            },
            {
                path: 'department-management/department-detail/:id',
                component: DepartmentManagementDetailComponent,
                data: {title: 'department Management'}
            },

            {path: 'user-management', component: UserManagementComponent, data: {title: 'User Management'}},
            {
                path: 'user-management/add-edit-user/:id',
                component: AddEditUserComponent,
                data: {title: 'User Management'}
            },
            {path: 'user-management/view-user/:id', component: ViewUserComponent, data: {title: 'User Management'}},
            {path: 'inquiry', component: InquiryComponent, data: {title: 'Inquiry Management'}},
            {path: 'inquiry/inquiry-detail/:id', component: ViewInquiryComponent, data: {title: 'Inquiry Management'}},
            {path: 'career', component: CareerComponent, data: {title: 'Career Management'}},
            {
                path: 'career/candidate-detail/:id',
                component: ViewCandidateComponent,
                data: {title: 'Career Management'}
            },

            {path: 'my-account/change-password', component: ChangePasswordComponent, data: {title: 'My Account'}},
            {path: 'my-account/my-profile', component: MyProfileComponent, data: {title: 'My Account'}},
            {
                path: 'user-management/user-change-password/:id',
                component: UserChangePasswordComponent,
                data: {title: 'User Management'}
            },
            {
                path: 'pm-dashboard',
                component: ProjectManagementDashboardComponent,
                data: {title: 'Project Management Dashboard'}
            },
            {path: 'sales-dashboard', component: SalesDashboardComponent, data: {title: 'Sales Management Dashboard'}},


            // SUPERADMINS & SALESMANAGERS & BUSINESSDEVELOPMENTMANAGER & BUSINESSDEVELOPMENTEXECUTIVE
            {path: 'sales-management', component: SalesManagementComponent, data: {title: 'Lead Management'}},
            {
                path: 'sales-management/add-new-lead/:id',
                component: AddNewLeadComponent,
                data: {title: 'Lead Management'}
            },
            {path: 'sales-management/view-lead/:id', component: ViewLeadComponent, data: {title: 'Lead Management'}},
        ]
    },
    { path: '**', component:PageNotFoundComponent, pathMatch: 'full'},
];

@NgModule({
    //imports: [ RouterModule.forRoot(routes, {  : 'disabled' }) ],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
