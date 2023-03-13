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
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {SelectionModel} from '@angular/cdk/collections';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import {PMHelperService} from "../../../../../services/PMHelper.service";
import {CancelDeletePopupComponent} from "../../../../popup/cancel-delete-popup/cancel-delete-popup.component";

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
  selector: 'app-project-data',
  templateUrl: './project-data.component.html',
  styleUrls: ['./project-data.component.scss']
})
// export class ProjectDataComponent implements OnInit {

export class ProjectDataComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild('clearString') clearString!: ElementRef;
  @ViewChild('hotLeads') hotLeads!: ElementRef;
  pageSizeOptions: number[] = [10, 20, 30, 40, 50, 100];
  page = 1;
  size: any = 10;
  perPage: any;
  currentPage = 0;
  selectedCategory: any;
  sortBy: any = -1;
  sortKey: any;
  projects: any;
  search: any;
  projectData : any;
  projectCode :any;
  projectDescription : any;
  projectName : any;
  dataSource: any = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  selectedValue: any = 'all';
  toppings = new FormControl('');
  toppingList: any[] =
    [
      {name: 'All', value: 'all'},
      {name: 'In Progress', value: 'in progress'},
      {name: 'Completed', value: 'completed'},
      {name: 'On Hold', value: 'on hold'}
    ]

  selectedLeadId: any;
  subCategory: any[] = [];
  category: any[] = [];
  isVisible: boolean = false
  name: any;
  image: any;
  email: any;
  meta: any;
  activeSort: any;
  directionSort: any;
  selectedProjectId: any;
  tabLabel:string = 'Details'
  url: any;
  projectStatus: any = 'all';
  projectId: string | null = "0";
  displayedColumns: string[] = ['action2','title', 'expectedDate', 'milestoneStatus'];
  selection = new SelectionModel<projects>(true, []);
  selected:number=0;

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
    let tabInd = localStorage.getItem('selectedIndex')
    let tabIndLabel = localStorage.getItem('selectedIndexLabel')
    if(tabIndLabel){
      this.tabLabel = JSON.parse(tabIndLabel)
    }
    if(tabInd){
      this.selected = +tabInd
    }
    var data: DataObject = {};
    this.getMilestoneList(data);
    this.viewProjectDetailsApi(this.projectId);
  }

  selectTabIndex(e:any){
    this.tabLabel = e.tab.textLabel
    localStorage.setItem('selectedIndex',e.index)
    localStorage.setItem('selectedIndexLabel',JSON.stringify(e.tab.textLabel))
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
  }

  // Get Project list
  getMilestoneList = (data: any) => {
    if (this.projectId){
      data.projectId = this.projectId;
    }
    if (this.search) {
      data.search = this.search;
    }
    if (this.sortBy && this.sortKey) {
      data.sortBy = this.sortBy;
      data.sortKey = this.sortKey;
    }
    if (this.currentPage) {
      data.page = this.currentPage;
    }
    if (this.perPage) {
      data.limit = this.perPage;
    }
    this.apiService.listMilestone(data).subscribe(data => {
      if (data && data?.meta && data.meta.status == 1) {
        this.projects = data.data
        this.dataSource = new MatTableDataSource<projects>(this.projects)
        this.meta = data.meta.totalCount;
      }
    })
  }

  filterByLeadStatus = (value: any) => {
    this.selectedValue = value;
    this.getMilestoneList({});
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
    this.getMilestoneList({});
  }

  clearSearch = (event: any) => {
    this.isVisible = true;
    this.search = '';
    this.searchString.nativeElement.value = '';
    if (this.searchString.nativeElement.value === '') {
      this.isVisible = false;
    }
    this.getMilestoneList({});
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected = () => {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.selectedProjectId = this.dataSource.data.filter((e: projects) => this.selection.isSelected(e)).map((e: { projectId: any; }) => e.projectId);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle = ($event: any) => {
    // console.log($event)
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: projects) => this.selection.select(row));
  }

  pageChange = (obj: any) => {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.getMilestoneList({});
  }

  viewProjectDetailsApi(id: any) {
    this.apiService.getProject(id).subscribe((data: any) => {
      this.projectData = data.data;
      this.projectCode = data.data.projectCode;
      this.projectDescription = data.data.projectDescription;
      this.projectName = data.data.projectName;
    }, data => {
      swal.fire('Error!', data.meta.message, 'info');
    });
  }

  // Delete Project
  deleteMilestone = (milestoneId: any) => {
    this.searchString.nativeElement.value = '';
    this.getMilestoneList({});
    const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Project?',key:"Delete Project",icon:"delete-icon.png"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteMilestone(milestoneId).subscribe(
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
                this.getMilestoneList({})
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

  // View Milestone
  viewProject(id: any): any {
    this.router.navigate(['project-management/project-details/project-data/' + id,]);
  }

  sortData(sortKey: any, sortBy: any) {
    this.sortBy = (sortBy === -1) ? 1 : -1;
    this.sortKey = sortKey;
    this.getMilestoneList({});
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

}
