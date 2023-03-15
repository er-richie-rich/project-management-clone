import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {PMHelperService} from "../../../services/PMHelper.service";
import {MatSort, Sort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import swal from "sweetalert2";
import {CancelDeletePopupComponent} from "../../popup/cancel-delete-popup/cancel-delete-popup.component";

interface DataObject {
  [key: string]: any;
}
export interface inventory {
  empCode: any;
  empName: string;
  system:any;
  systemType:any;
  os:any;
}
@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.scss']
})
export class InventoryManagementComponent implements OnInit {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  pageSizeOptions: number[] = [10, 20, 30, 40, 50, 100];
  page = 1;
  size: any = 10;
  perPage: any = 10;   currentPage = 1;
  sortBy: any;
  sortKey: any;
  inventoryData: any;
  search: any;
  dataSource: any = new MatTableDataSource([]);
  isVisible: boolean = false
  meta: any;
  headers: string[] = ['Action','Employee Name','System','System Type','Os','Ram Size'];
  columns: string[] = ['action', 'empName','systemType','pc','os','ram'];
  // displayedColumns: string[] = ['action2','employeeName','systemType','system','os','ram'];
  selection = new SelectionModel<inventory>(true, []);

  /**
   *
   * @param dialog
   * @param apiService
   * @param router
   * @param renderer
   * @param activatedRoute
   * @param http
   * @param helper
   */
  constructor(
      public dialog: MatDialog,
      private apiService: PMApiServicesService,
      private router: Router,
      private renderer: Renderer2,
      public activatedRoute: ActivatedRoute,
      private http: HttpClient,
      private helper : PMHelperService
  ) {
  }

  ngOnInit(): void {
    this.helper.removeIsClicked()
    var data: DataObject = {};
    this.getInventoryData(data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
  }

  /**
   *
   * @param obj
   */
  pageChange = (obj: any) => {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.getInventoryData({ page: this.currentPage});
  }

  // Delete Inventory
  /**
   *
   * @param inventoryId
   */
  deleteInventory = (inventoryId: any) => {
    this.searchString.nativeElement.value = '';
    this.getInventoryData({});
    const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Inventory?',key:"Delete Inventory",icon:"delete-icon.png"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteInventory(inventoryId).subscribe(
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
                  this.getInventoryData({})
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

  // Inventory Details
  setLocalStorage(){
    localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
    localStorage.setItem('perPage', this.perPage)
  }

  inventoryDetail(inventoryId:any){
    this.setLocalStorage()
    this.router.navigate([`/inventory-management/inventory-detail/` + inventoryId]);
  }

  // Edit Inventory
  /**
   *
   * @param inventoryId
   */
  editInventory = (inventoryId: any) => {
    this.setLocalStorage()
    this.router.navigate(['inventory-management/add-edit-inventory/' + inventoryId]).then();
  }

  // Get Inventory List
  /**
   *
   * @param data
   */
  getInventoryData = (data: any) => {
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
    this.apiService.inventoryList(data).subscribe(data => {
          if (data && data?.meta && data.meta.status == 1) {
            this.inventoryData = data.data
            this.dataSource = new MatTableDataSource<inventory>(this.inventoryData)
            let isClicked = localStorage.getItem('isClicked');
            if(isClicked){
              this.goToPage()
            }
            localStorage.removeItem('isClicked')
            localStorage.removeItem('page')
            localStorage.removeItem('perPage')
            if(this.inventoryData.length === 0){
              this.paginator?.previousPage()
            }
            this.meta = data.meta.totalCount;
            this.helper.toggleLoaderVisibility(false)
          }
        },
        error => {
        },
        () => {
        }
    )
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

  // Filter for Search
  /**
   *
   * @param event
   */
  applyFilter(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    } else {
      this.paginator.firstPage();
      this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.isVisible = this.search !== '';
      this.getInventoryData({});
    }
  }


  clearSearch = () => {
    this.paginator.firstPage();
    this.searchString.nativeElement.value = '';
    if (this.searchString.nativeElement.value === '') {
      this.isVisible = false;
      this.search = '';
    }
    this.getInventoryData({});
  }


  // Sort Column function
  // /**
  //  *
  //  * @param sort
  //  */
  // sortData(sort: Sort): void {
  //   var data: DataObject = {};
  //   if (sort.active && sort.direction) {
  //     this.sortBy = sort.direction === 'asc' ? 1 : -1;
  //     console.log('this.sortKey',sort.active)
  //     'employeeCode' === sort.active ? this.sortKey = 'employeeCode' : '';
  //     'employeeName' === sort.active ? this.sortKey = 'employeeName' : '';
  //     'systemType' === sort.active ? this.sortKey = 'systemType' : '';
  //     'system' === sort.active ? this.sortKey = 'pc' : '';
  //     'os' === sort.active ? this.sortKey = 'os' : '';
  //     'ram' === sort.active ? this.sortKey = 'ram' : '';
  //     data.sortKey = this.sortKey;
  //     data.sortBy = this.sortBy;
  //   }
  //   this.getInventoryData({});
  // }


  sortingData(sortKey: any, sortBy: any) {
    this.sortBy = (sortBy === -1) ? 1 : -1;
    this.sortKey = sortKey;
    this.getInventoryData({});
  }

}
