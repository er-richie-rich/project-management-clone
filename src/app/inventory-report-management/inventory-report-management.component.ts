import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {PMApiServicesService} from "../../services/PMApiServices.service";
import {PMHelperService} from "../../services/PMHelper.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import swal from "sweetalert2";
import {PopupUpdateStatusComponent} from "../popup/popup-update-status/popup-update-status.component";
import {FormControl} from "@angular/forms";

export interface reports {
  title: any;
  accessModule: any;
}
interface DataObject {
  [key: string]: any;
}

@Component({
  selector: 'app-inventory-report-management',
  templateUrl: './inventory-report-management.component.html',
  styleUrls: ['./inventory-report-management.component.scss']
})
export class InventoryReportManagementComponent implements OnInit {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  reportsList = new FormControl('');
  reportsListing: any[] =
      [
        {name: 'All', value: 'All'},
        {name: 'Open Reports', value: 'Open'},
        {name: 'Closed Reports', value: 'Closed'},
      ]
  pageSizeOptions: number[] = [10,20,30,40,50,100];
  page = 1;
  size: any = 10;
  perPage: any = 10;
  currentPage = 1;
  sortBy: any;
  sortKey: any;
  reportList:any;
  reportStatus:any;
  selectedValue: any = 'All';
  meta:any;
  dataSource: any = new MatTableDataSource([]);
  isVisible: boolean = false;
  search:any;
  inventoryReportColumns: string[] = ['employeeName','inventoryType','title','action'];
  selection = new SelectionModel<reports>(true, []);

  constructor(private apiService: PMApiServicesService,
              private helper : PMHelperService,
              private router: Router,
              public dialog: MatDialog,
              public route: ActivatedRoute,) {
     this.reportStatus = this.route.snapshot.queryParamMap.get("reportStatus");
  }

  ngOnInit(): void {
    var data: DataObject = {};
    this.getAllReports(data);
  }

  filterByLeadStatus = (value: any) => {
    this.reportStatus = value;
    this.getAllReports({});
  }

  getAllReports = (data:any) =>{
    data.page = this.currentPage;
    data.limit = this.perPage;
    if(this.reportStatus){
      data.reportStatus = this.reportStatus
      this.selectedValue = this.reportStatus
    } else {
      data.reportStatus = 'All'
    }
    if (this.sortBy && this.sortKey) {
      data.sortBy = this.sortBy;
      data.sortKey = this.sortKey;
    }
    if (this.search) {
      data.search = this.search;
    }
    this.helper.toggleLoaderVisibility(true)
    this.apiService.inventoryReportList(data).subscribe((res:any)=>{
      if (res && res?.meta && res.meta.status == 1) {
        this.reportList = res.data
        this.dataSource = new MatTableDataSource<reports>(this.reportList)
         this.meta = res.meta.totalCount;
        this.helper.toggleLoaderVisibility(false)
      }
    })
  }
  //
  pageChange = (obj: any) => {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.getAllReports({ page: this.currentPage});
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
      this.getAllReports({});
    }
  }
  clearSearch = () => {
    this.paginator.firstPage();
    this.searchString.nativeElement.value = '';
    if (this.searchString.nativeElement.value === '') {
      this.isVisible = false;
      this.search = '';
    }
    this.getAllReports({});
  }
  viewReportDetail(id:any){
  }
  closeReport(id:any){
    const reqData = {
      reportInventoryId : id,
      reportStatus : 'Closed'
    }
    const dialogRef = this.dialog.open(PopupUpdateStatusComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to close report?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.closeReport(reqData).subscribe((data: any) => {
          if (data && data?.meta) {
            if (data.meta.status == 1) {
              let metaMassgae = data.meta.message;
              swal.fire({
                icon: 'success',
                title: metaMassgae,
                timer: 1500
              });
              this.getAllReports({});
            }
          }
        })
      }
    });
  }
  sortingData(sortKey: any, sortBy: any) {
    this.sortBy = (sortBy === -1) ? 1 : -1;
    this.sortKey = sortKey;
    this.getAllReports({});
  }
}
