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
import {LoginComponent} from './authentication/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ResetPasswordComponent} from './authentication/reset-password/reset-password.component';
import {ForgotPasswordComponent} from './authentication/forgot-password/forgot-password.component';
import {DashboardComponent} from './common/dashboard/dashboard.component';
import {AuthGuardService} from 'src/services/auth-guard.service';
import {AuthServiceService} from 'src/services/auth-service.service';
import {ProjectManagementComponent} from './core/project-management/project-management.component';
import {AddEditProjectComponent} from './core/project-management/add-edit-project/add-edit-project.component';
import {ChangeRequestComponent} from './core/project-management/project-details/change-request/change-request.component';
import {FilesManageComponent} from './core/project-management/project-details/files-manage/files-manage.component';
import {TaskManageComponent} from './core/project-management/project-details/task-manage/task-manage.component';
import {UserManagementComponent} from './core/user-management/user-management.component';
import {ChangePasswordComponent} from './common/my-account/change-password/change-password.component';
import {MyProfileComponent} from './common/my-account/my-profile/my-profile.component';
import {AddFileComponent} from './core/project-management/project-details/files-manage/add-file/add-file.component';
import {AddEditUserComponent} from './core/user-management/add-edit-user/add-edit-user.component';
import {AddMilestoneComponent} from './core/project-management/project-details/project-data/add-milestone/add-milestone.component';
import {AddChangeRequestComponent} from './core/project-management/project-details/change-request/add-change-request/add-change-request.component';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import {PMHelperService} from 'src/services/PMHelper.service';
import {HttpClientModule} from '@angular/common/http';
import {SearchFilterPipePipe} from 'src/pipe/searchFilterPipe.pipe';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {LeaveManagementComponent} from './core/leave-management/leave-management.component';
import {UserChangePasswordComponent} from './core/user-management/user-change-password/change-password.component';
import {ProjectDataComponent} from './core/project-management/project-details/project-data/project-data.component';
import {ImportantDocumentComponent} from './core/important-document/important-document.component';
import {DashboardHrComponent} from './common/dashboard/hr-dashboard/dashboard-hr.component';
import {PopupLeaveRejectComponent} from './popup/popup-leave-reject/popup-leave-reject.component';
import {ProjectManagementDashboardComponent} from './common/dashboard/project-management-dashboard/project-management-dashboard.component';
import {PopupHrPolicyComponent} from './popup/popup-hr-policy/popup-hr-policy.component';
import {EmployeeManagementComponent} from './core/employee-management/employee-management.component';
import {EmployeeManagementDetailComponent} from './core/employee-management/employee-management-detail/employee-management-detail.component';
import {AddEditEmployeeComponent} from './core/employee-management/add-edit-employee/add-edit-employee.component';
import {PopupTaskListComponent} from './popup/popup-task-list/popup-task-list.component';
import {PopupTaskCardComponent} from './popup/popup-task-card/popup-task-card.component';
import {ApplyLeaveComponent} from './core/leave-management/apply-leave/apply-leave.component';
import {DocumentManagementComponent} from './core/document-management/document-management.component';
import {AddEditDocumentManagementComponent} from './core/document-management/add-edit-document-management/add-edit-document-management.component';
import {AnnouncementComponent} from './core/announcement/announcement.component';
import {MyLeavesComponent} from './core/leave-management/my-leaves/my-leaves.component';
import {SalesManagementComponent} from './core/sales-management/sales-management.component';
import {InquiryComponent} from './core/inquiry/inquiry.component';
import {SalesDashboardComponent} from './common/dashboard/sales-dashboard/sales-dashboard.component';
import {UserMgmtComponent} from './common/dashboard/user-mgmt/user-mgmt.component';
import {AddNewLeadComponent} from './core/sales-management/add-new-lead/add-new-lead.component';
import {CareerComponent} from './core/career/career.component';
import {ViewLeadComponent} from './core/sales-management/view-lead/view-lead.component';
import {ViewInquiryComponent} from './core/inquiry/view-inquiry/view-inquiry.component';
import {ViewCandidateComponent} from './core/career/view-candidate/view-candidate.component';
import {ViewUserComponent} from './core/user-management/view-user/view-user.component';
import {CustomFormsModule} from 'ng2-validation';
// import {PopupImportUserComponent} from './popup/popup-import-user/popup-import-user.component';
// import {FileUploadDirective} from "./popup/popup-import-user/file-upload.directive";
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
import { InventoryManagementComponent } from './core/inventory-management/inventory-management.component';
import { DepartmentManagementComponent } from './core/department-management/department-management.component';
import { AddEditDepartmentComponent } from './core/department-management/add-edit-department/add-edit-department.component';
import { AddEditInventoryComponent } from './core/inventory-management/add-edit-inventory/add-edit-inventory.component';
import { InventoryManagementDetailComponent } from './core/inventory-management/inventory-management-detail/inventory-management-detail.component';
import { DepartmentManagementDetailComponent } from './core/department-management/department-management-detail/department-management-detail.component';
import { TicketManagementComponent } from './core/ticket-management/ticket-management.component';
import { PopupTodayActivitiesComponent } from './popup/popup-today-activities/popup-today-activities.component';
import { ProjectDetailsComponent } from './core/project-management/project-details/project-details.component';
import { ProjectLogComponent } from './core/project-management/project-details/project-log/project-log.component';
import { AddEditTicketComponent } from './core/ticket-management/add-edit-ticket/add-edit-ticket.component';
import { TicketDetailsComponent } from './core/ticket-management/ticket-details/ticket-details.component';
import { LeaveDetailComponent } from './core/leave-management/leave-detail/leave-detail.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {PageNotFoundComponent} from "./common/page-not-found/page-not-found.component";
import { PopupYearlyLeaveListComponent } from './popup/popup-yearly-leave-list/popup-yearly-leave-list.component';
import { HolidaysManagementComponent } from './core/leave-management/holidays-management/holidays-management.component';
import { AddEditHolidaysComponent } from './core/leave-management/holidays-management/add-edit-holidays/add-edit-holidays.component';
import { DashboardCardComponent } from './common/dashboard-card/dashboard-card.component';
import { CancelDeletePopupComponent } from './popup/cancel-delete-popup/cancel-delete-popup.component';
import { ImportDataPopupComponent } from './popup/import-data-popup/import-data-popup.component'
import{FileUploadDirective} from "./popup/file-upload.directive";
import { DataTableComponent } from './common/data-table/data-table.component';

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
        PopupUpdateStatusComponent,
        CareerComponent,
        ViewLeadComponent,
        ViewInquiryComponent,
        ViewCandidateComponent,
        ViewUserComponent,
        // PopupImportUserComponent,
        FileUploadDirective,
        PopupUpdateStatusComponent,
        PopupAddLeaveComponent,
        InventoryManagementComponent,
        DepartmentManagementComponent,
        AddEditDepartmentComponent,
        AddEditInventoryComponent,
        InventoryManagementDetailComponent,
        DepartmentManagementDetailComponent,
        TicketManagementComponent,
        PopupTodayActivitiesComponent,
        ProjectDetailsComponent,
        ProjectLogComponent,
        AddEditTicketComponent,
        TicketDetailsComponent,
        LeaveDetailComponent,
        PageNotFoundComponent,
        PopupYearlyLeaveListComponent,
        HolidaysManagementComponent,
        AddEditHolidaysComponent,
        DashboardCardComponent,
        CancelDeletePopupComponent,
        ImportDataPopupComponent,
        DataTableComponent
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
