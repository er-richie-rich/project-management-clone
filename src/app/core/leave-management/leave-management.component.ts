import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import { MatDialog } from '@angular/material/dialog';
import swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PopupLeaveRejectComponent } from '../../popup/popup-leave-reject/popup-leave-reject.component';
import {FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PMHelperService } from 'src/services/PMHelper.service';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/ja';

@Component({

  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'}
  ]
})
export class LeaveManagementComponent implements OnInit {
  roleName = "";
  pageSizeOptions: number[] = [10,20,30,40,50,100];
  meta:any;
  authUser: any = {};
  leaveType: any = [
    {value: 'LWP'},
    {value: 'Casual'},
    {value: 'Sick'},
  ];
  sortBy: any = -1;
  sortKey: any;
  page = 0;
  currentPage = 1;
  perPage = 10;
  requestPara = {};
  search:any;
  filter: any;
  leaveData:any;
  selectedValue:string='All'
  StatusValueList: any[] =
      [
        {name: 'All', value: 'All'},
        {name: 'Pending', value: 'Pending'},
        {name: 'Cancelled', value: 'Cancelled'},
        {name: 'Rejected', value: 'Rejected'},
        {name: 'Approved', value: 'Approved'},
      ]
  filterFromDate:any;
  filterLeaveType:any;
  filterToDate:any;
  filterUserId:any = '';
  filterempDetail: any = FormGroup;
  employeeName: any = [];
  authUserId:any;
  statusType:any;
  // leaveColumns: string[] = ['empName', 'leaveDuration', 'leaveDurationDetail', 'leaveType','leaveReason', 'fromDate', 'toDate','total','availableBalance','appliedDate', 'action'];
  columns: string[] = ['fullName', 'leaveDuration', 'leaveDurationDetail', 'leaveType','leaveReason', 'fromDate', 'toDate','totalDays','availableBalance','AppliedLeaveDate', 'action2'];
  headers: string[] = ['Emp Name', 'Leave Duration', 'Leave Duration Detail', 'Leave Type','Leave Reason', 'From Date', 'To Date','Total','Available Balance','Applied Date', 'Action'];
  dateFields:string[]=['fromDate', 'toDate', 'AppliedLeaveDate']
  leaveDataSource: any = new MatTableDataSource([]);
  isVisible:boolean = false;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort
  @ViewChild('searchString') searchString!: ElementRef;
  private subject: Subject<string> = new Subject();
  
  /**
   *
   * @param apiService
   * @param dialog
   * @param _formBuilder
   * @param helper
   */
  constructor(
      private apiService: PMApiServicesService,
      public dialog: MatDialog,
      private _formBuilder: FormBuilder,
      private helper: PMHelperService,
    ){
      this.filterempDetail = this._formBuilder.group({
        userId: [''],
        leaveType: [''],
        fromDate: [''],
        toDate: ['']
      });

      let authUser: any = localStorage.getItem('loggedInUser');
      if (authUser) {
        this.authUser = JSON.parse(authUser);
        this.authUserId = this.authUser._id;
        this.roleName = this.authUser.roleKey
      }
    }

  ngOnInit(): void {
    this.helper.removeIsClicked()
    this.getLeaveList({});
    this.subject.pipe(debounceTime(500)).subscribe(searchTextValue => {
      this.applyFilter(searchTextValue);
    });
    this.apiService.lisEmp({limit:1000, loginUser:this.authUserId}).subscribe((data: any) => {
      this.employeeName = data.data;
    }, err => {
    });
  }
  
  /**
   *
   * @param event
   */
  onSearch(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    } else {
      this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.isVisible = this.search !== '';
      this.paginator.firstPage();
      this.currentPage = 1;
      this.subject.next(event.target.value);
    }
  }
  
  /**
   *
   * @param filterValue
   */
  applyFilter(filterValue: string) {
    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase()
    }
    this.filter = filterValue;
    this.leaveDataSource.data = [];
    this.search = filterValue;
    this.getLeaveList({});
  }
  
  /**
   *
   * @param req
   */
  getLeaveList(req: any): any {
    req.limit= this.perPage;
    req.page= this.currentPage;
    if (this.selectedValue) {
      req.leaveStatus = this.selectedValue;
    }
    if (this.search){
      req.search =this.search
    }
    if (this.sortBy && this.sortKey) {
      req.sortBy = this.sortBy;
      req.sortKey = this.sortKey;
    }
    if (this.filterFromDate){
      req.fromDate= this.filterFromDate
    }
    if (this.filterLeaveType){
      req.leaveType =this.filterLeaveType
    }
    if (this.filterToDate){
      req.toDate =this.filterToDate
    }
    if (this.filterUserId){
      req.userId =this.filterUserId
    } else {
      req.userId = ''
    }
    this.helper.toggleLoaderVisibility(true)
    this.apiService.leaveTransactionListing(req).subscribe((data: any) => {
      this.leaveData = data.data
      this.leaveDataSource = new MatTableDataSource(this.leaveData);
      if(this.leaveData.length === 0 && this.currentPage > 1){
        this.paginator?.previousPage()
      }
      this.meta = data.meta.totalCount;
      this.helper.toggleLoaderVisibility(false)
    });
  }

  filterByStatus = (value: any) => {
    this.paginator.firstPage();
    this.selectedValue = value;
    this.getLeaveList({});
  }
  
  /**
   *
   * @param obj
   */
  pageChange = (obj: any) => {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.getLeaveList({ page: this.currentPage,limit:this.perPage});
  }
  
  /**
   *
   * @param _id
   */
  confirmReject(_id: any) {
    const dialogRef = this.dialog.open(PopupLeaveRejectComponent, {
      width: "500px",
      data: { leaveId: _id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getLeaveList({});
        swal.fire({
          icon: 'success',
          title: result.data.meta.message,
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }
  
  /**
   *
   * @param id
   */
  leaveApprove(id: any) {
    let data = {
      leaveId: id,
      leaveStatus: "Approved"
    }
    this.apiService.approveAndRejectLeave(data).subscribe(data => {
      this.getLeaveList({});
      if (data && data.meta.status === 0){
        swal.fire({
          icon: 'info',
          title: data.meta.message,
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        swal.fire({
          icon: 'success',
          title: data.meta.message,
          showConfirmButton: false,
          timer: 2000
        });
      }
      
    })
  }
  
  /**
   *
   * @param event
   */
  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
  
  onEmpDataFilter(): any {
    if(this.filterempDetail.value.fromDate){
      this.filterFromDate=this.filterempDetail.value.fromDate.getTime();
    }
    if(this.filterempDetail.value.toDate){
      this.filterToDate=this.filterempDetail.value.toDate.getTime();
    }
    this.filterLeaveType=this.filterempDetail.value.leaveType;
    this.filterUserId=this.filterempDetail.value.userId;
    this.getLeaveList({});
    
  }
  
  resetData() {
    this.filterFromDate = null;
    this.filterLeaveType = null;
    this.filterToDate = null;
    this.filterUserId = null;
    this.filterempDetail.reset();
    this.filterempDetail.patchValue({
      userId: ''
    });
    this.getLeaveList({});
  }
  
  clearSearch = () => {
    this.paginator.firstPage();
    this.searchString.nativeElement.value = '';
    if (this.searchString.nativeElement.value === '') {
      this.isVisible = false;
      this.search = '';
    }
    this.getLeaveList({});
  }
  sortData(sortKey: any, sortBy: any) {
    this.sortBy = (sortBy === -1) ? 1 : -1;
    this.sortKey = sortKey;
    this.getLeaveList({});
  }
  // public leaveReasonflag = false;
  // public checkVisited() {
  //   this.leaveReasonflag = !this.leaveReasonflag;
  // }
  ngOnDestroy(): void { }
}
