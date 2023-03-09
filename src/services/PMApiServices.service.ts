import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {environment} from '../environments/environment';
import {Router} from '@angular/router';
import {PMHelperService} from './PMHelper.service';
import {catchError, finalize, share, tap} from 'rxjs/operators';
import swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class PMApiServicesService {
  baseUrl: string = environment.baseURL;
  newBaseUrl: string = environment.newBaseURL;
  private httpOptions: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private helper: PMHelperService,
  ) {
  }

  public getHeader(): any {
    const tokenData = localStorage.getItem('tokenData');
    if (tokenData) {
      this.httpOptions = {
        headers: new HttpHeaders({
          Accept: 'application/json',
          Authorization: 'Bearer ' + tokenData
        }),
      };
    }
    return this.httpOptions;
  }

  login(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'auth/login', data);
  }

  changePassword(data: any) {
    return this.http.post(this.baseUrl + 'auth/change-password', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'auth/forgot-password', data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'auth/reset-password', data);
  }

  dashboard(): Observable<any> {
    return this.http.post(this.baseUrl + 'dashboard/view', null, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)))
  }

  // project-management
  addEditProject(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'project/addEdit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  getProject(id: string): Observable<any> {
    return this.http.post(this.baseUrl + 'project/view', {projectId: id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  listProject(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'project/list', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)));
  }

  deleteProject(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'project/delete', {projectId: id}, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  deleteMultipleProject(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'project/delete-all-project', {projectId: id}, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  getProjectManager() {
    return this.http.post(this.baseUrl + 'project/list-project-manager', null, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)));
  }

  addEditMileStone(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'milestone/addEdit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  // project-management -project details- Milestone
  getMilestone(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'milestone/view', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  listMilestone(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'milestone/list', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)));
  }

  deleteMilestone(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'milestone/delete', {milestoneId: id}, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  // file-manage-project-details
  addEditFile(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'projectFile/addEdit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  getFile(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'projectFile/view', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  listFile(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'projectFile/list', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)));
  }

  deleteFile(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'projectFile/delete', {projectFileId: id}, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  addEditUser(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/addEdit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }


getUserReporingManager(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/list-reporting-manager', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)));
  }

  // usermanagement
  listRole(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'role/list', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)));
  }

  listUser(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/list', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }
  
  sendMailToEmployee(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/send-mail', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  editUser(data: any) {
    return this.http.post(this.baseUrl + 'user/edit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  getUser(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/view', {userId: id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  

  getUserdetail(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/view', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  editProfile(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/edit-profile', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  deleteUser(userId: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/delete', {userId: userId}, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  userChangePassword(data: any) {
    return this.http.post(this.baseUrl + 'auth/change-password', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  changeRequestList(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'changeRequest/list', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)));
  }

  /* Change request  */
  addEditChangeRequestApi(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'changeRequest/addEdit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  deleteChangeRequest(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'changeRequest/delete', {changeRequestId: id}, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  viewChangeRequestApi(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'changeRequest/view', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //leave -management
  leaveTransactionListing(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'leaves/leave-transaction-listing', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }
  addLeaveBalance(data:any): Observable<any> {
    return this.http.post(this.baseUrl + 'leaves/add-leave-balance', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }
  viewLeaveBalance(data:any): Observable<any> {
    return this.http.post(this.baseUrl + 'leaves/view-leave-balance', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  leavefilterListing(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'leaves/list', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  getLeaveDetail(data:any){
    return this.http.post(this.baseUrl + 'leaves/view', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  lisEmp(data:any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/list', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  selectLeaveType() {
    return this.http.post(this.baseUrl + 'leaves/list', null, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)));
  }

  applyLeave(data:any): Observable<any> {
    return this.http.post(this.baseUrl + 'leaves/transaction', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  approveAndRejectLeave(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'leaves/action', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  myLeaveListing(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'leaves/my-leaves', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }
  cancelLeave(data:any){
    return this.http.post(this.baseUrl + 'leaves/cancel-leave', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  /* Project Task List */
  listTaskApi(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'taskList/list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  addEditTaskListApi(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'taskList/addEdit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  deleteListTaskApi(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'taskList/delete', {taskListId: id}, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  viewListTaskApi(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'taskList/view', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  /* Project Task Card */
  addEditTaskCardApi(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'listCard/addEdit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  viewCardTaskApi(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'listCard/view', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  deleteCardTaskApi(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'listCard/delete', {listCardId: id}, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  changeSortOrderApi(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'listCard/changeSortOrder', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  changeListSortOrderApi(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'taskList/changeSortOrder', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  // Document-Management-api
  documentListing(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'document/list-visible-document', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  // Document-Management-api- role:- Hr & admin
  documentListingHrAd(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'document/list', data, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x))).pipe(catchError((x) => this.handleAuthError(x)))
  }

  addEditDocument(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'document/add-edit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  deletedocument(documentId: any): Observable<any> {
    return this.http.post(this.baseUrl + 'document/delete', {documentId: documentId}, this.getHeader()).pipe(catchError((x) => this.handleAuthError(x)));
  }

  getDocument(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'document/view', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  // announcement
  onAnnouncement(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'announcement/add-edit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Sales Person
  salesPerson(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'lead/sales-person-list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Status Update for Hot Lead
  salesHotLeadStatusUpdate(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'lead/edit-lead-status', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Delete multiple and single sales row
  salesDeleteRows(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'lead/delete-all-leads', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Delete multiple and single inquiry row
  inquiryDeleteRows(data: any): Observable<any> {
    return this.http.post(this.newBaseUrl + 'delete-all-inquiry', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Delete multiple and single users row
  deleteAllUser(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/delete-all-users', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Export All Leads
  exportAllLeads(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'lead/export-leads', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Export All Leads
  exportAllInquiry(data: any): Observable<any> {
    return this.http.post(this.newBaseUrl + 'inquiry-export', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Import All Leads
  importAllLeads(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'lead/import-leads', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Import All users
  importAllUsers(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/import-users', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }


  //Download Sample File
  downloadSampleFile(data: any): Observable<any> {
    return this.http.post(this.newBaseUrl + 'sample-inquiry-excel', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Download Sample Leads File
  downloadSampleLeadsFile(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'lead/import-sample-leads-file', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Download Sample User File
  downloadSampleUserFile(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/import-sample-users-file', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Import Inquiry
  importAllInquiry(data: any): Observable<any> {
    return this.http.post(this.newBaseUrl + 'inquiry-import', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Export All Users
  exportAllUsers(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/export-users', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  // Sales Lead Generated By List
  salesLeadGeneratedBy(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'lead/lead-generated-by-list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Sales Leads
  salesLeads(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'lead/list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Delete Sales Leads
  deleteSalesLeads(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'lead/delete', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Edit Sales Leads
  editSalesLeads(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'lead/add-edit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //ViewSales Leads
  viewSalesLeads(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'lead/view', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Dashboard View
  dashboardLeads(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'dashboard/view', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //inquiry
  inquiryLists(data: any): Observable<any> {
    return this.http.post(this.newBaseUrl + 'inquiry-list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Inquiry Detail
  inquiryDetail(data: any): Observable<any> {
    return this.http.post(this.newBaseUrl + 'inquiry-details', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Delete Inquiry
  deleteInquiryLists(data: any): Observable<any> {
    return this.http.post(this.newBaseUrl + 'delete-contact-us', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Career List
  careerLists(data: any): Observable<any> {
    return this.http.post(this.newBaseUrl + 'career-list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //Delete Career Item
  deleteCareerItems(data: any): Observable<any> {
    return this.http.post(this.newBaseUrl + 'delete-career', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  //View Career Detail
  viewCareerDetail(data: any): Observable<any> {
    return this.http.post(this.newBaseUrl + 'career-details', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  inventoryList(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'inventory/list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  
  getInventory(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'inventory/view', {inventoryId: id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  addEditInventory(data:any){
    return this.http.post(this.baseUrl + 'inventory/add-edit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  
  deleteInventory(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'inventory/delete', {inventoryId: id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  deleteDepartment(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'department/delete', {departmentId: id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  departmentList(data:any){
    return this.http.post(this.baseUrl + 'department/list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  inventoryReportList(data:any){
    return this.http.post(this.baseUrl + 'report-inventory/list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  getDepartment(id:any){
    return this.http.post(this.baseUrl + 'department/view', {departmentId: id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  addDepartment(data:any){
    return this.http.post(this.baseUrl + 'department/add-edit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  closeReport(data:any){
    return this.http.post(this.baseUrl + 'report-inventory/action', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  addInventoryReport(data:any){
    return this.http.post(this.baseUrl + 'report-inventory/report', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  getUserInventoryId(){
    return this.http.post(this.baseUrl + 'inventory/view-employee-inventory', null, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  ticketList(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'ticket/list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  addEditTicket(data: any) {
    return this.http.post(this.baseUrl + 'ticket/add-edit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  viewTicket(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'ticket/view', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  getTicket(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'ticket/view', {ticketId: id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  deleteTicket(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'ticket/delete', {ticketId: id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  markAsResolve(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'ticket/action', {ticketId: id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  cancleTicket(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'ticket/cancel-ticket', {ticketId: id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  getUnReadTicketCount(data:any): Observable<any> {
    return this.http.post(this.baseUrl + 'ticket/unread-count',data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  sendMessage(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'ticket/ticket-conversation', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  getTodayLeaveList(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'leaves/today-leaves', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  getTodayBirthdayList(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/today-birthday', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  getTodayAnniversaryList(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'user/today-anniversary', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }


 getHolidaysList(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'holiday/list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  addEditHolidays(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'holiday/add-edit', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  deleteHoliday(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'holiday/delete', {holidayId: id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  viewHoliday(id: any): Observable<any> {
    return this.http.post(this.baseUrl + 'holiday/view', {holidayId: id}, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  projectLogList(data:any){
    return this.http.post(this.baseUrl + 'project/list-project-activity', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  probationDateEndList(){
    return this.http.post(this.baseUrl + 'user/today-probation-period-ends', null,this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }

  getYearlyLeaveList(data:any){
    return this.http.post(this.baseUrl + 'leaves/all-users-leave-list', data, this.getHeader()).pipe(catchError(this.handleAuthError)).pipe(catchError((x) => this.handleAuthError(x)));
  }
  private handleAuthError(err: HttpErrorResponse): any {
    if (err.status === 400) {
      swal.fire(
          '',
          err.error.message,
          'error'
      ).then(()=>{
        this.helper.toggleLoaderVisibility(false)
      });
    }
    if (err.status === 401) {
      PMHelperService.onLogOut();
      const e = err.error;
      this.helper.toggleLoaderVisibility(false)
      this.router.navigate(['/']);
    }
    if(err.status === 500){
      swal.fire(
          '',
          err.error.message,
          'error'
      ).then();
    }
    return throwError(err);
  }
}
