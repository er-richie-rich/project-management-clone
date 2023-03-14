import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {SelectionModel} from "@angular/cdk/collections";
import {PMApiServicesService} from "../../../../services/PMApiServices.service";
import {PMHelperService} from "../../../../services/PMHelper.service";
import {Router} from "@angular/router";
import swal from "sweetalert2";
import {MatDialog} from "@angular/material/dialog";
import {CancelDeletePopupComponent} from "../../../popup/cancel-delete-popup/cancel-delete-popup.component";

interface DataObject {
  [key: string]: any;
}
export interface holidays {
  holidayTitle: any;
  holidayDate: any;
  HolidayDay:any;
}
@Component({
  selector: 'app-holidays-management',
  templateUrl: './holidays-management.component.html',
  styleUrls: ['./holidays-management.component.scss']
})
export class HolidaysManagementComponent implements OnInit {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  pageSizeOptions: number[] = [10,20];
  page = 1;
  size: any = 10;
  perPage: any = 10;
  currentPage = 1;
  sortBy: any;
  sortKey: any;
  meta:any;
  holidaysList:any;
  dataSource: any = new MatTableDataSource([]);
  isVisible: boolean = false;
  search:any;
  // holidaysColumns: string[] = ['action2','holidayName','holidayDate','holidayDay'];
  columns: string[] = ['action2','holidayName','holidayDate','holidayDay'];
  headers: string[] = ['Action','Name','Date','Day'];
  dateFields:string[]=['holidayDate','holidayDay']
  selection = new SelectionModel<holidays>(true, []);
  userRole:any
  user:any


  constructor(private apiService: PMApiServicesService,
              private helper : PMHelperService,
              private router: Router,
              public dialog: MatDialog,
              ){
    this.user =JSON.parse(localStorage.getItem('loggedInUser') || '{}')
    this.userRole=this.user.roleKey
if(this.userRole !== 'HRMANAGERS'){
  // this.holidaysColumns = ['holidayName','holidayDate','holidayDay'];
  this.columns = ['holidayName','holidayDate','holidayDay'];
  this.headers = ['Name','Date','Day'];
}
  }

  ngOnInit(): void {
    this.helper.removeIsClicked()
    var data: DataObject = {};
    this.getHolidaysList(data);
  }

  getHolidaysList = (data: any) => {
    let perPage = localStorage.getItem('perPage')
    if(perPage){
      this.perPage = perPage;
    }
    data.page = this.currentPage;
    data.limit = this.perPage;
    if (this.sortBy && this.sortKey) {
      data.sortBy = this.sortBy;
      data.sortKey = this.sortKey;
    }
    if (this.search) {
      data.search = this.search;
    }
    this.helper.toggleLoaderVisibility(true)
    this.apiService.getHolidaysList(data).subscribe((res:any)=>{
        if (res && res?.meta && res.meta.status == 1) {
        this.holidaysList = res.data
        this.dataSource = new MatTableDataSource<holidays>(this.holidaysList)
        let isClicked = localStorage.getItem('isClicked');
        if(isClicked){
          this.goToPage()
        }
        localStorage.removeItem('isClicked')
        localStorage.removeItem('page')
        localStorage.removeItem('perPage')
        if(this.holidaysList.length === 0 && this.currentPage > 1){
          this.paginator?.previousPage()
        }
        this.meta = res.meta.totalCount;
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


  pageChange = (obj: any) => {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.getHolidaysList({ page: this.currentPage});
  }
  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
  applyFilter(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    } else {
      this.paginator.firstPage();
      const filterValue = (event.target as HTMLInputElement).value;
      this.search = filterValue.trim().toLowerCase();
      this.isVisible = this.search !== '';
      this.getHolidaysList({});
    }
  }

  editHolidays(holidayId:any){
    this.setLocalStorage()
    this.router.navigate(['holidays-management/add-edit-holidays/' + holidayId]);
  }

  deleteHoliday(holidayId:any){
    this.getHolidaysList({});
    const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this holiday?',key:"Delete Holiday",icon:"delete-icon.png"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteHoliday(holidayId).subscribe(
            data => {
              if (data && data?.meta) {
                if (data.meta.status == 1) {
                  this.dataSource = new MatTableDataSource(this.dataSource.data);
                  let metaData: any = data.meta.message;
                  swal.fire(
                      'Deleted!',
                      metaData,
                      'success'
                  ).then();
                  this.getHolidaysList({})
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

  setLocalStorage(){
    localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
    localStorage.setItem('perPage', this.perPage)
  }

  sortingData(sortKey: any, sortBy: any) {
    this.sortBy = (sortBy === -1) ? 1 : -1;
    this.sortKey = sortKey;
    this.getHolidaysList({});
  }


}
