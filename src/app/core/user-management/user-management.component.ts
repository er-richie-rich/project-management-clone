import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {SelectionModel} from "@angular/cdk/collections";
import {DatePipe} from "@angular/common";
import {saveAs} from "file-saver";

import {PopupUpdateStatusComponent} from "../../popup/popup-update-status/popup-update-status.component";
import {PageEvent} from "@angular/material/paginator";
import {PMHelperService} from "../../../services/PMHelper.service";
import {CancelDeletePopupComponent} from "../../popup/cancel-delete-popup/cancel-delete-popup.component";
import {ImportDataPopupComponent} from "../../popup/import-data-popup/import-data-popup.component";

export interface users {
  action2: string;
  empCode: number;
  fullName: string;
  email: any;
  mobileNumber: any;
  userRole: any;
  status: any;
}

interface DataObject {
  [key: string]: any
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild('clearString') clearString!: ElementRef;
  @ViewChild('hotLeads') hotLeads!: ElementRef;
  pageSizeOptions: number[] = [10,20,30,40,50,100];
  page = 0;
  size: any = 10;
  perPage: any= 10;
  currentPage = 1;
  selectedValue: any = 'All';
  selectedNewValue: any;
  sortBy: any;
  sortKey: any;
  search: any;
  headers: string[] = ['','Action','Employee Code','Full Name','Email','Mobile Number','User Role','Status'];
  columns: string[] = ['selectall', 'action', 'empCode', 'fullName', 'email', 'mobileNumber', 'userRole','status'];

  dataSource: any = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
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
  isVisible: boolean = false
  email: any;
  selectedHotLead: any = false;
  leadType: any;
  meta: any;
  activeSort: any;
  directionSort: any;
  listUser: any;
  isChecked: boolean = false;
  selectedUserId: any;
  url: any;
  user_type: any;
  filename: any;
  displayedColumns: string[] = ['selectall', 'action2', 'empCode', 'fullName', 'email', 'mobileNumber', 'userRole', 'status'];
  selection = new SelectionModel<users>(true, []);

  constructor(
    public dialog: MatDialog,
    private apiService: PMApiServicesService,
    private router: Router,
    private helper: PMHelperService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.user_type = this.activatedRoute.snapshot.queryParamMap.get("user");
    if (this.user_type === 'super-admin') {
      this.selectedValue = 'Super Admin';
    } else if (this.user_type === 'BDE') {
      this.selectedValue = 'Business Development Executive';
    } else if (this.user_type === 'BDM') {
      this.selectedValue = 'Business Development Manager';
    } else if (this.user_type === 'sales-managers') {
      this.selectedValue = 'Sales Manager';
    } else if (this.user_type === 'hr-managers') {
      this.selectedValue = 'HR Manager';
    } else if (this.user_type === 'project-managers') {
      this.selectedValue = 'Project Manager';
    }else if (this.user_type === 'Team Leader') {
      this.selectedValue = 'Team Leader';
    }else if (this.user_type === 'Team Member') {
      this.selectedValue = 'Team Member';
    }
  }

  ngOnInit(): void {
    this.helper.removeIsClicked()
    var data: DataObject = {};
    if (this.selectedValue) {
      data.userRole = this.selectedValue;
    }
      this.getUserData(data)
  }

  ngOnDestroy(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected = () => {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.selectedUserId = this.dataSource.data.filter((e: users) => this.selection.isSelected(e)).map((e: { userId: any; }) => e.userId);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
 /* masterToggle = ($event: any) => {
    // console.log($event)
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: users) => this.selection.select(row));
  }*/
  masterToggle = ($event: any) => {
    if($event.checked){
      this.dataSource.data.forEach((row: users) => this.selection.select(row));
    } else {
      this.selection.clear()
      this.selectedUserId = null
    }
  }

  deleteAllUsers = () => {
    if (this.selectedUserId === null) {
      swal.fire(
        '',
        "Please select at least one row to delete",
        'info'
      );
    } else {
      const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
        width: "500px",
        data: {message: 'Are you sure you want to delete this Users?',key:"Delete User",icon:"delete-icon.png"}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.apiService.deleteAllUser({userId: this.selectedUserId}).subscribe(
            data => {
              if (data && data?.meta) {
                if (data.meta.status == 1) {
                  this.dataSource = new MatTableDataSource(this.dataSource.data);
                  let metaData: any = data.meta.message;
                  swal.fire(
                    'Deleted!',
                    metaData,
                    'success'
                  ).then(()=>{
                    this.selection.clear();
                    this.getUserData({})
                  });
                } else {
                  swal.fire(
                    'Error!',
                    data.meta.message,
                    'error'
                  ).then();
                }
              } else {
                swal.fire(
                  'Error!',
                  "Server Error",
                  'error'
                ).then();
              }
            }
          )
        } else {
          this.selection.clear();
          this.getUserData({})
          /*this.selection.clear();
          window.location.reload();*/
        }
      })
    }
  }
  
  exportAllUsers = () => {
    this.helper.toggleLoaderVisibility(true)
    this.apiService.exportAllUsers({userId: this.selectedUserId}).subscribe(
      data => {
        if (data && data?.meta) {
          if (data.meta.status == 1) {
            this.url = data.data.url;
            const date = new DatePipe('en-US').transform(new Date(), 'ddMMyy');
            const filename = 'users_' + date + '.xlsx';
            saveAs.saveAs(this.url, filename);
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.helper.toggleLoaderVisibility(false)
            swal.fire(
              'Exported!',
              data.meta.message,
              'success'
            ).then(()=>{
              this.selectedUserId = null;
            });
            this.getUserData({})
          } else {
            swal.fire(
              'Error!',
              data.meta.message,
              'error'
            ).then();
          }
        } else {
          swal.fire(
            'Error!',
            "Server Error",
            'error'
          ).then();
        }
      }
    )
  }

  /////////////////////////////////////////////////////////////////
/*  pageChange(obj: any) {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.getUserData({limit: this.perPage, page: this.currentPage});
  }*/

  pageChange(page: PageEvent): void {
    // this.search = '';
    this.currentPage = page.pageIndex + 1 ;
    this.perPage= page.pageSize
    this.selection.clear()
    this.selectedUserId = null
    this.getUserData({});
  }


  // Get Users
  getUserData = (data: any) => {
    let perPage = localStorage.getItem('perPage')
    if(perPage){
      this.perPage = +perPage;
    }
    data.page = this.currentPage;
    data.limit = this.perPage;
    if (this.selectedValue) {
      data.userRole = this.selectedValue;
    }
    if (this.sortBy && this.sortKey) {
      data.sortBy = this.sortBy;
      data.sortKey = this.sortKey;
    }
    if (this.search) {
      data.searchKey = this.search;
    }
    this.helper.toggleLoaderVisibility(true)
    this.apiService.listUser(data).subscribe(data => {
        if (data && data?.meta && data.meta.status == 1) {
          this.listUser = data.data
          this.dataSource = new MatTableDataSource<users>(this.listUser)
          let isClicked = localStorage.getItem('isClicked');
          if(isClicked && this.currentPage > 0){
            this.goToPage()
          }
          localStorage.removeItem('isClicked')
          localStorage.removeItem('page')
          localStorage.removeItem('perPage')
          if(this.listUser.length === 0 && this.currentPage > 1){
            this.paginator?.previousPage()
          }
          this.meta = data.meta.totalCount;
          this.helper.toggleLoaderVisibility(false)
        } else {
          this.helper.toggleLoaderVisibility(false)
        }
      })
  }


  setLocalStorage(){
    localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
    localStorage.setItem('perPage', this.perPage)
  }

  //Edit User
  editUser(id: any): any {
    this.setLocalStorage()
    this.router.navigate(['user-management/add-edit-user/' + id]);
  }

  userDetail(id:any){
    this.setLocalStorage()
    this.router.navigate(['user-management/view-user/' + id]);
  }

  // Chnage Password
  changePassword(id: any) {
    this.router.navigate(['user-management/user-change-password/' + id]);
  }

  //Delete User
  deleteUser(userId: any): any {
    const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this User?',key:"Delete User",icon:"delete-icon.png"}
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
                this.selection.clear();
                this.getUserData({});
              });
              
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
          this.selection.clear();
          this.getUserData({});
          // this.userDataSource.data.splice(index, 1);
          // this.userDataSource = new MatTableDataSource(this.userDataSource.data);
        });
      }
    });
  }

  // Filter for Search
  applyFilter(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    } else {
      this.paginator.firstPage();
      // const filterValue = (event.target as HTMLInputElement).value;
      this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.isVisible = this.search !== '';
      this.getUserData({});
    }
  }

  clearSearch = (event: any) => {
    this.paginator.firstPage();
    this.searchString.nativeElement.value = '';
    if (this.searchString.nativeElement.value === '') {
      this.isVisible = false;
      this.search = '';
    }
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

  // Sort Column function
  sortData(sort: Sort): void {
    var data: DataObject = {};
    if (sort.active && sort.direction) {
      this.sortBy = sort.direction === 'asc' ? 1 : -1;
      'empCode' === sort.active ? this.sortKey = 'empCode' : '';
      'fullName' === sort.active ? this.sortKey = 'fullName' : '';
      'email' === sort.active ? this.sortKey = 'email' : '';
      'mobileNumber' === sort.active ? this.sortKey = 'mobileNumber' : '';
      'userRole' === sort.active ? this.sortKey = 'userRole' : '';
      'status' === sort.active ? this.sortKey = 'status' : '';
      data.sortKey = this.sortKey;
      data.sortBy = this.sortBy;
    }
    this.getUserData({});
  }

  updateActiveStatus(userId: any, status: any, $event: MatSlideToggleChange) {
    const data = {
      userId: userId,
      status: status == 1 ? 2 : 1
    }
    const dialogRef = this.dialog.open(PopupUpdateStatusComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to update status of an User?'
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
              this.getUserData({})
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
      this.getUserData({});
    });
  }
  //Download Sample File
  downloadSampleFile = () => {
    this.apiService.downloadSampleUserFile({}).subscribe(
      data => {
        if (data && data?.meta) {
          if (data.meta.status == 1) {
            this.url = data.data.url;
            const date = new DatePipe('en-US').transform(new Date(), 'ddMMyy');
            const filename = 'user_import_sample_' + date + '.xlsx';
            saveAs.saveAs(this.url, filename);
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            let metaData: any = data.meta.message;
            this.selection.clear();
            swal.fire(
              'Success',
              metaData,
              'success'
            ).then();
            this.getUserData({})
          } else {
            swal.fire(
              'Error!',
              data.meta.message,
              'error'
            ).then();
          }
        } else {
          swal.fire(
            'Error!',
            "Server Error",
            'error'
          ).then();
        }
      }
    )
  }

  //Import User Data
  importUserData = async () => {
    const dialogRef = this.dialog.open(ImportDataPopupComponent, {
      width: "600px",
      disableClose: true,
      data:{name:'Users',fileName:'user_import_sample_'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const formData = new FormData();
        formData.append("userFile", result);
        this.apiService.importAllUsers(formData).subscribe(data => {
              if (data && data?.meta) {
                if (data.meta.status == 1) {
                  this.dataSource = new MatTableDataSource(this.dataSource.data);
                  swal.fire({
                        title: 'Success!',
                        icon: 'success',
                        html:
                            data.meta.message +
                            '<div class="mt-3 py-2 alert alert-success" role="alert">\n' +
                            +data.data.successCount + '  Records are imported successfully.\n' +
                            '</div>' +
                            '<div class="mt-3 py-2 alert alert-danger" role="alert">\n' +
                            +data.data.failCount + '  Records are failed to import.\n' +
                            '</div>'
                      }
                  ).then();
                  this.getUserData({})
                } else {
                  swal.fire(
                      'Error!',
                      data.meta.message,
                      'error'
                  ).then();
                }
              } else {
                swal.fire(
                    'Error!',
                    "Server Error",
                    'error'
                ).then();
              }
            }
        )
      }
    })
  }

  filterByUserRole = (value: any) => {
    this.paginator.firstPage();
    this.selectedValue = value;
    this.getUserData({});
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
  test(e:any){
    console.log(e)
      }
}
