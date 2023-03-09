/*import { Component, OnInit, ViewChild } from '@angular/core';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import { PopupConfirmDeleteComponent } from '../popup/popup-confirm-delete/popup-confirm-delete.component';
import {MatDialog} from '@angular/material/dialog';
import swal from 'sweetalert2';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Subject} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PMHelperService } from 'src/services/PMHelper.service';
import {debounceTime} from 'rxjs/operators';


@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent implements OnInit {
  loadData: any = true;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 0;
  direction = '';
  public current_page = 1;
  public limit = 25;
  public requestPara = {};
  public filter: any;
  url: any = "assets/images/profile-picture-default.png";

  userColumns: string[] = ['empCode', 'fullName', 'email', 'dob', 'doj', 'status', 'reportingManager', 'viewDetails'];
  userDataSource :any= new MatTableDataSource([]);
  userId :string|null ="0";
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  private subject: Subject<string> = new Subject();

   constructor(private apiService:PMApiServicesService,
    private router: Router,
    ){}
    ngOnInit(): void {
      this.getUserList({page: 1,limit:25});
      this.subject.pipe(debounceTime(500)).subscribe(searchTextValue => {
        this.applyFilter(searchTextValue);
        });
  }
  applyFilter(filterValue: string) {
    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase()}
      this.filter = filterValue;
      this.userDataSource.data = [];
      this.requestPara = {
      searchKey: filterValue,
      limit: this.limit,
      page: this.current_page,
};
    this.getUserList(this.requestPara);
  }
  editFile(id:string)
  {
    this.router.navigate([`/employee-management/employee-detail/`+id]);

  }
    //for serching
    onKeyUp(event: any){
      this.current_page = 1;
      this.subject.next(event.target.value);
    }
  // user status maintain
  updateActiveStatus(userId : any) {

    let index: any = PMHelperService.findWithAttr(this.userDataSource.data, "_id", userId._id)

    let objectData = null;
    if(this.userDataSource.data[index]) {
      //this.userDataSource.data[index].status = !userId.status
      this.userDataSource.data[index].status
      objectData = this.userDataSource.data[index];
    }

    //this.apiService.editUser(objectData);
    let data = {
      userId : objectData._id,
      status : objectData.status == false ? 1 : 2,
    }
    this.apiService.addEditUser(data).subscribe((data: any) => {
       let metaMassgae=data.meta.message;
       swal.fire({  icon: 'success',
       title:metaMassgae,
       showConfirmButton: false,
       timer: 1500
});
    })
    //userId.status = !userId.status;
  }
   // user list
   getUserList(req: any): any {
    if(this.loadData){
        this.apiService.listUser(req).subscribe((data: any) => {

          let listData=data.data;
           this.userId=data.data._id
          this.loadData = (listData.length > 0);
          listData.forEach((b: any) => {
            b.status = b.status === 1 ? true : false
            this.userDataSource.data.push(b);
            });
          this.userDataSource = new MatTableDataSource(this.userDataSource.data);
          this.userDataSource.paginator = this.paginator;
         //this.userDataSource = data.data;
         });
      }

      }

 // infinite scrolling
 public onScrollDown(): void {
  this.current_page +=  1;
  this.direction='down';
  this.requestPara = {
    page: this.current_page,
    limit:this.limit
};
  this.getUserList(this.requestPara);
}

}*/

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {PMApiServicesService} from "../../services/PMApiServices.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {SelectionModel} from '@angular/cdk/collections';
import {HttpClient} from "@angular/common/http";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {PopupUpdateStatusComponent} from "../popup/popup-update-status/popup-update-status.component";
import {PMHelperService} from "../../services/PMHelper.service";
import {PopupConfirmDeleteComponent} from "../popup/popup-confirm-delete/popup-confirm-delete.component";
import {users} from "../user-management/user-management.component";
import {PopupAddLeaveComponent} from "../popup/popup-add-leave/popup-add-leave.component";
import {FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {Subject} from "rxjs";

export interface employess {
  employeeId: any
  status: any;
}

interface DataObject {
  [key: string]: any
}

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})

export class EmployeeManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild('clearString') clearString!: ElementRef;
  @ViewChild('hotLeads') hotLeads!: ElementRef;
  pageSizeOptions: number[] = [10,20,30,40,50,100];
  page = 1;
  size: any = 10;
  perPage: any = 10;
  currentPage = 1;
  requestBody: any = {};
  sortBy: any = -1;
  sortKey: any;
  employees: any;
  search: any;
  selectedRole: any = 'All';
  toppings = new FormControl('');
  toppingList: any[] =
      [
        {name: 'All', value: 'All'},
        {name: 'Super Admin', value: 'Super Admin'},
        {name: 'Business Development Executive', value: 'Business Development Executive'},
        {name: 'Business Development Manager', value: 'Business Development Manager'},
        {name: 'Sales Manager', value: 'Sales Manager'},
        {name: 'HR Manager', value: 'HR Manager'},
        {name: 'Project Manager', value: 'Project Manager'},
        {name: 'Team Leader', value: 'Team Leader'},
        {name: 'Team Member', value: 'Team Member'},
      ]
  url: any = "assets/images/profile-picture-default.png";
  dataSource: any = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  isVisible: boolean = false
  meta: any;
  userColumns: string[] = ['action2','profilePic','EmpCode','fullName', 'emailId', 'role','departmentName','totalLeaveBalance','totalTakenLeave', 'dob', 'doj', 'status', 'reportingManager'];
  selection = new SelectionModel<employess>(true, []);
  private subject: Subject<string> = new Subject();

  constructor(
    public dialog: MatDialog,
    private apiService: PMApiServicesService,
    private router: Router,
    private renderer: Renderer2,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private helper : PMHelperService
  ) {
    // this.setSearch()
  }

  ngOnInit(): void {
    this.helper.removeIsClicked()
    var data: DataObject = {};
    this.getUserList(data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  pageChange = (obj: any) => {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.getUserList({});
  }

  //Edit User
  editUser(id: any): any {
    this.setLocalStorage()
    this.router.navigate(['employee-management/add-edit-employee/' + id]);
  }


  //Add Leave
  addLeave(userId: any){
    const dialogRef = this.dialog.open(PopupAddLeaveComponent, {
      width: "500px",
      data: { userId: userId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.getLeaveList({});
        swal.fire({
          icon: 'error',
          title: result.data.meta.message,
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }
  //Delete User
  deleteUser(userId: any, index: any, event: any): any {
    const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Employee?'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteUser(userId).subscribe(data => {
          if (data && data?.meta) {
            if (data.meta.status == 1) {
              let metaData: any = data.meta.message;
              this.dataSource = new MatTableDataSource<users>(this.dataSource.data);
              swal.fire(
                  'Deleted!',
                  metaData,
                  'success'
              ).then(() => {
                // window.location.reload();
              });
              this.selection.clear();
              this.getUserList({});
            } else {
              swal.fire(
                  '',
                  data.meta.message,
                  'error'
              );
            }
          } else {
            swal.fire(
                'Error!',
                "Server Error",
                'error'
            );
          }
          // this.userDataSource.data.splice(index, 1);
          // this.userDataSource = new MatTableDataSource(this.userDataSource.data);
        });
      }
    });
  }

  updateActiveStatus(userId: any, status: any, $event: MatSlideToggleChange) {
    const data = {
      userId: userId,
      status: status == 1 ? 2 : 1
    }
    const dialogRef = this.dialog.open(PopupUpdateStatusComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to update status of an Employee?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.addEditUser(data).subscribe((data: any) => {
          if (data && data?.meta) {
            if (data.meta.status == 1) {
              let metaMassgae = data.meta.message;
              swal.fire({
                icon: 'success',
                title: metaMassgae,
                timer: 1500
              });
              $event.checked = true;
              this.getUserList({})
            } else {
              $event.checked = false;
              swal.fire(
                'Error!',
                data.meta.message,
                'error'
              );
            }
          } else {
            swal.fire(
              'Error!',
              "Server Error",
              'error'
            );
          }
        })
      }
      this.getUserList({});
    });
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

  // updateActiveStatus(userId: any, status: any, $event: MatSlideToggleChange) {
  //   let data = {
  //     userId: userId,
  //     status: status == 1 ? 2 : 1
  //   }
  //   console.log("data",data)
  //   this.apiService.addEditUser(data).subscribe((data: any) => {
  //     if (data && data?.meta) {
  //       if (data.meta.status == 1) {
  //         let metaMassgae = data.meta.message;
  //         swal.fire({
  //           icon: 'success',
  //           title: metaMassgae,
  //           timer: 1500
  //         });
  //         $event.checked = true;
  //         this.getUserList({})
  //       } else {
  //         $event.checked = false;
  //         swal.fire(
  //           'Error!',
  //           data.meta.message,
  //           'error'
  //         );
  //       }
  //     } else {
  //       swal.fire(
  //         'Error!',
  //         "Server Error",
  //         'error'
  //       );
  //     }
  //   })
  // }

  setLocalStorage(){
    localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
    localStorage.setItem('perPage', this.perPage)
  }

  userDetail(id: any) {
    this.setLocalStorage()
    this.router.navigate([`/employee-management/employee-detail/` + id]);
  }

  /*Get Employees*/
  getUserList = (data: any) => {
    let perPage = localStorage.getItem('perPage')
    if(perPage){
      this.perPage = perPage;
    }
    data.userRole = this.selectedRole;
    data.page = this.currentPage;
    data.limit = this.perPage;
    if (this.sortBy && this.sortKey) {
      data.sortBy = this.sortBy;
      data.sortKey = this.sortKey;
    }
    if (this.search) {
      data.searchKey = this.search;
    }
    this.helper.toggleLoaderVisibility(true)
    this.apiService.listUser(data).subscribe((data: any) => {
      if (data && data?.meta && data.meta.status == 1) {
        this.employees = data.data
        this.dataSource = new MatTableDataSource<employess>(this.employees)
        let isClicked = localStorage.getItem('isClicked');
        if(isClicked){
          this.goToPage()
        }
        localStorage.removeItem('isClicked')
        localStorage.removeItem('page')
        localStorage.removeItem('perPage')
        if(this.employees.length === 0 && this.currentPage > 1){
          this.paginator?.previousPage()
        }
        this.meta = data.meta.totalCount;
        this.helper.toggleLoaderVisibility(false)
      }
    })
  }

  goToPage() {
    let pageNumber = localStorage.getItem('page')
    if(pageNumber){
      this.paginator.pageIndex = +pageNumber;
      this.paginator.page.next({
        pageIndex: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
        length: this.paginator.length
      });
    }
  }
  
  sendEMail(userId:string, isMailSent:boolean){
    if (!isMailSent){
      this.helper.toggleLoaderVisibility(true)
      this.apiService.sendMailToEmployee({userId:userId}).subscribe((data: any) => {
        if (data && data?.meta && data.meta.status == 1) {
          this.getUserList({})
          swal.fire({
            icon: 'success',
            title: data.meta.message,
            timer: 2000
          });
        }
        this.helper.toggleLoaderVisibility(false)
      })
     
    } else {
      swal.fire({
        icon: 'info',
        title: 'Email has been already sent to this employee',
        timer: 5000
      });
    }
  }

  filterByUserRole(role:any){
    this.selectedRole = role;
    this.paginator?.firstPage()
    this.getUserList({});
  }
  applyFilter(event: any) {
    this.subject.next((event.target as HTMLInputElement).value);
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    } else {
      this.paginator.firstPage();
      const filterValue = (event.target as HTMLInputElement).value;
      this.search = filterValue.trim().toLowerCase();
      this.isVisible = this.search !== '';
      this.getUserList({})
    }

  }

  // private setSearch(){
  //   this.subject.pipe(debounceTime(1000)).subscribe((res: string) =>{
  //     this.getUserList({});
  //   })
  // }

  clearSearch = (event: any) => {
    this.paginator.firstPage();
    this.searchString.nativeElement.value = '';
    if (this.searchString.nativeElement.value === '') {
      this.isVisible = false;
      this.search = '';
    }
    this.getUserList({});
  }



  /*Filter for Search*/
  // applyFilter(event: any) {
  //   this.isVisible = true;
  //
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.search = filterValue.trim().toLowerCase();
  //   if(this.search){
  //     this.currentPage = 1;
  //     // this.ngAfterViewInit();
  //   } else {
  //     if (this.searchString.nativeElement.value === '') {
  //       this.isVisible = false;
  //     }
  //   }
  //   this.getUserList({});
  // }
  //
  // clearSearch = (event: any) => {
  //   this.isVisible = true;
  //   this.search = '';
  //   this.searchString.nativeElement.value = '';
  //   // this.ngAfterViewInit();
  //   if (this.searchString.nativeElement.value === '') {
  //     this.isVisible = false;
  //   }
  //   this.currentPage = 1
  //   this.ngAfterViewInit();
  //   this.getUserList({});
  // }

  sortData(sortKey: any, sortBy: any) {
    this.sortBy = (sortBy === -1) ? 1 : -1;
    this.sortKey = sortKey;
    this.getUserList({});
  }
}
