import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {ActivatedRoute, Router} from "@angular/router";
import {SelectionModel} from '@angular/cdk/collections';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import {employess} from "../../../employee-management/employee-management.component";
import {PMHelperService} from "../../../../../services/PMHelper.service";

export interface projects {
  projectId: any;
  projectName: string;
  status: any;
  projectDescription: any;
  action2: string;
  selectall: any;
}

interface DataObject {
  [key: string]: any
}

@Component({
  selector: 'app-project-log',
  templateUrl: './project-log.component.html',
  styleUrls: ['./project-log.component.scss']
})

export class ProjectLogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild('clearString') clearString!: ElementRef;
  @ViewChild('hotLeads') hotLeads!: ElementRef;
  pageSizeOptions: number[] = [10, 20, 30, 40, 50, 100];
  page = 1;
  size: any = 10;
  perPage: any;
  currentPage = 0;
  sortBy: any = -1;
  sortKey: any;
  search: any;
  projectCode :any;
  projectName:any;
  projectLogData:any
  projectDescription:any
  dataSource: any = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  selectedValue: any = 'all';
    selectedLeadId: any;
  subCategory: any[] = [];
  category: any[] = [];
  isVisible: boolean = false
  meta: any;
  activeSort: any;
  directionSort: any;
  projectId: string | null = "0";
  displayedColumns: string[] = ['editedBy','message','date'];
  selection = new SelectionModel<projects>(true, []);

  constructor(
      private apiService: PMApiServicesService,
      public dialog: MatDialog,
      public activatedRoute: ActivatedRoute,
      private router: Router,
      public helper:PMHelperService
  ) {
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id') || null;
  }

  ngOnInit(): void {
    this.helper.removeIsClicked()
    var data: DataObject = {};
    this.getProjectLogList(data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
  }

  // Get Project list
  getProjectLogList = (data: any) => {
    data.page = this.currentPage;
    data.limit = this.perPage;
    if (this.projectId){
      data.projectId = this.projectId;
    }
    this.apiService.projectLogList(data).subscribe((result:any) => {
      if(result.meta.status === 1){
       this.projectLogData = result.data;
        this.meta = result.meta.totalCount;
        this.dataSource = new MatTableDataSource<employess>(this.projectLogData)
      }
    })
  }

  filterByLeadStatus = (value: any) => {
    this.selectedValue = value;
  }

  // Filter for Search
  applyFilter(event: any) {
    this.isVisible = true;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    const filterValue = (event.target as HTMLInputElement).value;
    this.search = filterValue.trim().toLowerCase();
    this.currentPage = 0;
  }

  clearSearch = (event: any) => {
    this.isVisible = true;
    this.search = '';
    this.searchString.nativeElement.value = '';
    if (this.searchString.nativeElement.value === '') {
      this.isVisible = false;
    }
    this.getProjectLogList({});
  }
  pageChange = (obj: any) => {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.getProjectLogList({});
  }


  sortData(sortKey: any, sortBy: any) {
    this.sortBy = (sortBy === -1) ? 1 : -1;
    this.sortKey = sortKey;
    this.getProjectLogList({});
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

}


