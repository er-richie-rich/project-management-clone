import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './layout/layout.component';
import {HomelayoutComponent} from './layout/home-layout/homelayout.component';
import {LoginLayoutComponent} from './layout/login-layout/login-layout.component';
import {HeaderComponent} from './navigation/header/header.component';
import {SidenavListComponent} from './navigation/sidenav-list/sidenav-list.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialUiModule} from './material-ui/material-ui.module';
import {LoginComponent} from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuardService} from 'src/services/auth-guard.service';
import {AuthServiceService} from 'src/services/auth-service.service';
import {ProjectManagementComponent} from './project-management/project-management.component';
import {AddEditProjectComponent} from './project-management/add-edit-project/add-edit-project.component';
import {ChangeRequestComponent} from './project-management/project-details/change-request/change-request.component';
import {FilesManageComponent} from './project-management/project-details/files-manage/files-manage.component';
import {TaskManageComponent} from './project-management/project-details/task-manage/task-manage.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {ChangePasswordComponent} from './my-account/change-password/change-password.component';
import {MyProfileComponent} from './my-account/my-profile/my-profile.component';
import {AddFileComponent} from './project-management/project-details/files-manage/add-file/add-file.component';
import {AddEditUserComponent} from './user-management/add-edit-user/add-edit-user.component';
import {AddMilestoneComponent} from './project-management/project-details/project-data/add-milestone/add-milestone.component';
import {AddChangeRequestComponent} from './project-management/project-details/change-request/add-change-request/add-change-request.component';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import {PMHelperService} from 'src/services/PMHelper.service';
import {HttpClientModule} from '@angular/common/http';
import {PopupConfirmDeleteComponent} from './popup/popup-confirm-delete/popup-confirm-delete.component';
import {SearchFilterPipePipe} from 'src/pipe/searchFilterPipe.pipe';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {LeaveManagementComponent} from './leave-management/leave-management.component';
import {UserChangePasswordComponent} from './user-management/user-change-password/change-password.component';
import {ProjectDataComponent} from './project-management/project-details/project-data/project-data.component';
import {ImportantDocumentComponent} from './important-document/important-document.component';
import {DashboardHrComponent} from './dashboard/hr-dashboard/dashboard-hr.component';
import {PopupLeaveRejectComponent} from './popup/popup-leave-reject/popup-leave-reject.component';
import {ProjectManagementDashboardComponent} from './dashboard/project-management-dashboard/project-management-dashboard.component';
import {PopupHrPolicyComponent} from './popup/popup-hr-policy/popup-hr-policy.component';
import {EmployeeManagementComponent} from './employee-management/employee-management.component';
import {EmployeeManagementDetailComponent} from './employee-management/employee-management-detail/employee-management-detail.component';
import {AddEditEmployeeComponent} from './employee-management/add-edit-employee/add-edit-employee.component';
import {PopupTaskListComponent} from './popup/popup-task-list/popup-task-list.component';
import {PopupTaskCardComponent} from './popup/popup-task-card/popup-task-card.component';
import {ApplyLeaveComponent} from './leave-management/apply-leave/apply-leave.component';
import {DocumentManagementComponent} from './document-management/document-management.component';
import {AddEditDocumentManagementComponent} from './document-management/add-edit-document-management/add-edit-document-management.component';
import {AnnouncementComponent} from './announcement/announcement.component';
import {MyLeavesComponent} from './leave-management/my-leaves/my-leaves.component';
import {SalesManagementComponent} from './sales-management/sales-management.component';
import {InquiryComponent} from './inquiry/inquiry.component';
import {SalesDashboardComponent} from './dashboard/sales-dashboard/sales-dashboard.component';
import {UserMgmtComponent} from './dashboard/user-mgmt/user-mgmt.component';
import {AddNewLeadComponent} from './sales-management/add-new-lead/add-new-lead.component';
import {CareerComponent} from './career/career.component';
import {ViewLeadComponent} from './sales-management/view-lead/view-lead.component';
import {ViewInquiryComponent} from './inquiry/view-inquiry/view-inquiry.component';
import {ViewCandidateComponent} from './career/view-candidate/view-candidate.component';
import {ViewUserComponent} from './user-management/view-user/view-user.component';
import {CustomFormsModule} from 'ng2-validation';
import {PopupImportUserComponent} from './popup/popup-import-user/popup-import-user.component';
import {FileUploadDirective} from './popup/popup-import-user/file-upload.directive';
import {PopupImportLeadsComponent} from './popup/popup-import-leads/popup-import-leads.component';
import {PopupImportInquiryComponent} from './popup/popup-import-inquiry/popup-import-inquiry.component';
import {DatePipe} from "@angular/common";
import {PopupUpdateStatusComponent} from "./popup/popup-update-status/popup-update-status.component";
import {AngularEditorModule} from '@kolkov/angular-editor';
import {NgxDocViewerModule} from "ngx-doc-viewer";
import {ModalModule} from 'ngb-modal';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SafePipeModule} from "safe-pipe";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {PdfViewerModule} from 'ng2-pdf-viewer';
import { PopupAddLeaveComponent } from './popup/popup-add-leave/popup-add-leave.component';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';
import { DepartmentManagementComponent } from './department-management/department-management.component';
import { AddEditDepartmentComponent } from './department-management/add-edit-department/add-edit-department.component';
import { AddEditInventoryComponent } from './inventory-management/add-edit-inventory/add-edit-inventory.component';
import { InventoryManagementDetailComponent } from './inventory-management/inventory-management-detail/inventory-management-detail.component';
import { DepartmentManagementDetailComponent } from './department-management/department-management-detail/department-management-detail.component';
import { InventoryReportManagementComponent } from './inventory-report-management/inventory-report-management.component';
import { ViewMyReportComponent } from './inventory-report-management/view-my-report/view-my-report.component';
import { PopupAddReportInventoryComponent } from './popup/popup-add-report-inventory/popup-add-report-inventory.component';
import { TicketManagementComponent } from './ticket-management/ticket-management.component';
import { PopupTodayActivitiesComponent } from './popup/popup-today-activities/popup-today-activities.component';
import { ProjectDetailsComponent } from './project-management/project-details/project-details.component';
import { ProjectLogComponent } from './project-management/project-details/project-log/project-log.component';
import { AddEditTicketComponent } from './ticket-management/add-edit-ticket/add-edit-ticket.component';
import { TicketDetailsComponent } from './ticket-management/ticket-details/ticket-details.component';
import { LeaveDetailComponent } from './leave-management/leave-detail/leave-detail.component';
import { PopupCancelLeaveComponent } from './popup/popup-cancel-leave/popup-cancel-leave.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import { PopupYearlyLeaveListComponent } from './popup/popup-yearly-leave-list/popup-yearly-leave-list.component';
import { HolidaysManagementComponent } from './leave-management/holidays-management/holidays-management.component';
import { AddEditHolidaysComponent } from './leave-management/holidays-management/add-edit-holidays/add-edit-holidays.component';


@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        HomelayoutComponent,
        LoginLayoutComponent,
        HeaderComponent,
        SidenavListComponent,
        LoginComponent,
        ResetPasswordComponent,
        ForgotPasswordComponent,
        ChangePasswordComponent,
        DashboardComponent,
        ProjectManagementComponent,
        AddEditProjectComponent,
        UserManagementComponent,
        MyProfileComponent,
        AddFileComponent,
        AddEditUserComponent,
        AddMilestoneComponent,
        AddChangeRequestComponent,
        ChangeRequestComponent,
        FilesManageComponent,
        TaskManageComponent,
        SearchFilterPipePipe,
        LeaveManagementComponent,
        UserChangePasswordComponent,
        ProjectDataComponent,
        ImportantDocumentComponent,
        DashboardHrComponent,
        PopupLeaveRejectComponent,
        ProjectManagementDashboardComponent,
        PopupHrPolicyComponent,
        EmployeeManagementComponent,
        EmployeeManagementDetailComponent,
        AddEditEmployeeComponent,
        PopupTaskListComponent,
        PopupTaskCardComponent,
        ApplyLeaveComponent,
        DocumentManagementComponent,
        AddEditDocumentManagementComponent,
        AnnouncementComponent,
        MyLeavesComponent,
        SalesManagementComponent,
        InquiryComponent,
        SalesDashboardComponent,
        UserMgmtComponent,
        AddNewLeadComponent,
        PopupConfirmDeleteComponent,
        PopupUpdateStatusComponent,
        CareerComponent,
        ViewLeadComponent,
        ViewInquiryComponent,
        ViewCandidateComponent,
        ViewUserComponent,
        PopupImportUserComponent,
        FileUploadDirective,
        PopupImportLeadsComponent,
        PopupImportInquiryComponent,
        PopupUpdateStatusComponent,
        PopupAddLeaveComponent,
        InventoryManagementComponent,
        DepartmentManagementComponent,
        AddEditDepartmentComponent,
        AddEditInventoryComponent,
        InventoryManagementDetailComponent,
        DepartmentManagementDetailComponent,
        InventoryReportManagementComponent,
        ViewMyReportComponent,
        PopupAddReportInventoryComponent,
        TicketManagementComponent,
        PopupTodayActivitiesComponent,
        ProjectDetailsComponent,
        ProjectLogComponent,
        AddEditTicketComponent,
        TicketDetailsComponent,
        LeaveDetailComponent,
        PopupCancelLeaveComponent,
        PageNotFoundComponent,
        PopupYearlyLeaveListComponent,
        PageNotFoundComponent,
        HolidaysManagementComponent,
        AddEditHolidaysComponent,

    ],
    imports: [
        PdfViewerModule,
        SafePipeModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialUiModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        InfiniteScrollModule,
        CustomFormsModule,
        AngularEditorModule,
        NgxDocViewerModule,
        ModalModule,
        NgbModule,
        Ng2SearchPipeModule, MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
    ],

    providers: [AuthGuardService, AuthServiceService, PMApiServicesService, PMHelperService, Title, DatePipe,{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
    bootstrap: [AppComponent]
})
export class AppModule {
}
