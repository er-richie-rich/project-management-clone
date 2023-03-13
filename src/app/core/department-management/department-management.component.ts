import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {SelectionModel} from "@angular/cdk/collections";
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {PMHelperService} from "../../../services/PMHelper.service";
import {Router} from "@angular/router";
import swal from "sweetalert2";
import {MatDialog} from "@angular/material/dialog";
import {CancelDeletePopupComponent} from "../../popup/cancel-delete-popup/cancel-delete-popup.component";

interface DataObject {
  [key: string]: any;
}
export interface department {
  title: any;
  accessModule: any;
}
@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.scss']
})
export class DepartmentManagementComponent implements OnInit {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5,10,20,30,40,50,100];
  page = 1;
  size: any = 10;
  perPage: any = 5;
  currentPage = 1;
  sortBy: any;
  sortKey: any;
  meta:any;
  departmentList:any;
  dataSource: any = new MatTableDataSource([]);
  isVisible: boolean = false;
  search:any;
  // departmentColumns: string[] = ['action','title','accessModule'];
  headers: string[] = ['Action','Title','AccessModule'];
  columns: string[] = ['action','departmentTitle','accessModule'];
  selection = new SelectionModel<department>(true, []);

  constructor(private apiService: PMApiServicesService,
              private helper : PMHelperService,
              private router: Router,
              public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.helper.removeIsClicked()
    var data: DataObject = {};
    this.getDepartmentList(data);
  }

  getDepartmentList = (data: any) => {
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
    this.apiService.departmentList(data).subscribe((res:any)=>{
      if (res && res?.meta && res.meta.status == 1) {
        this.departmentList = res.data
        this.dataSource = new MatTableDataSource<department>(this.departmentList)
        let isClicked = localStorage.getItem('isClicked');
        if(isClicked){
          this.goToPage()
        }
        localStorage.removeItem('isClicked')
        localStorage.removeItem('page')
        localStorage.removeItem('perPage')
        if(this.departmentList.length === 0 && this.currentPage > 1){
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
    this.getDepartmentList({ page: this.currentPage});
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
      this.getDepartmentList({});
    }
  }
  clearSearch = () => {
    this.paginator.firstPage();
    this.searchString.nativeElement.value = '';
    if (this.searchString.nativeElement.value === '') {
      this.isVisible = false;
      this.search = '';
    }
    this.getDepartmentList({});
  }

  editDepartment(departmentId:any){
    this.setLocalStorage()
    this.router.navigate(['department-management/add-edit-department/' + departmentId]).then();
  }

  deleteDepartment(departmentId:any){
    this.searchString.nativeElement.value = '';
    this.getDepartmentList({});
    const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Department?',key:"Delete Department",icon:"delete-icon.png"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteDepartment(departmentId).subscribe(
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
                  this.getDepartmentList({})
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
  detailDepartment(departmentId:any){
    this.setLocalStorage()
    this.router.navigate([`/department-management/department-detail/` + departmentId]);
  }

  setLocalStorage(){
    localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
    localStorage.setItem('perPage', this.perPage)
  }

  sortingData(sortKey: any, sortBy: any) {
    this.sortBy = (sortBy === -1) ? 1 : -1;
    this.sortKey = sortKey;
    this.getDepartmentList({});
  }

}
