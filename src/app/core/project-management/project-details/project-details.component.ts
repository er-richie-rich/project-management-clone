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
import {MatSort} from '@angular/material/sort';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {SelectionModel} from '@angular/cdk/collections';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import {PMHelperService} from "../../../../services/PMHelper.service";
import {CancelDeletePopupComponent} from "../../../popup/cancel-delete-popup/cancel-delete-popup.component";

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
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})

export class ProjectDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild('clearString') clearString!: ElementRef;
  @ViewChild('hotLeads') hotLeads!: ElementRef;
  pageSizeOptions: number[] = [10, 20, 30, 40, 50, 100];
  page = 1;
  size: any = 10;
  perPage: any = 10;
  currentPage = 1;
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
  url: any;
  projectStatus: any = 'all';
  projectId: string | null = "0";
  // displayedColumns: string[] = ['action2','title', 'expectedDate', 'milestoneStatus'];
  columns: string[] = ['action','milestoneTitle', 'expectedDate', 'milestoneStatus'];
  headers: string[] = ['Action','Title', 'Expected Date', 'Status'];
  dateFields:string[]=['expectedDate'];
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
    this.getMilestoneList(data);
    this.viewProjectDetailsApi(this.projectId);
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  ngOnDestroy(): void {
  }
  
  // Get Project list
  getMilestoneList = (data: any) => {
    let perPage = localStorage.getItem('perPage')
    if(perPage){
      this.perPage = perPage;
    }
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
        let isClicked = localStorage.getItem('isClicked');
        if(isClicked){
          this.goToPage()
        }
        localStorage.removeItem('isClicked')
        localStorage.removeItem('page')
        localStorage.removeItem('perPage')
        if(this.projects.length === 0 && this.currentPage > 1){
          this.paginator?.previousPage()
        }
        this.meta = data.meta.totalCount;
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
  
  filterByLeadStatus = (value: any) => {
    this.selectedValue = value;
    this.getMilestoneList({});
  }
  
  // Filter for Search
  applyFilter(event: any) {
    this.isVisible = true;
    this.paginator?.firstPage();
    const filterValue = (event.target as HTMLInputElement).value;
    this.search = filterValue.trim().toLowerCase();
    this.currentPage = 1;
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
      data: {message: 'Are you sure you want to delete this milestone?',key:"Delete Milestone",icon:"delete-icon.png"}
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
  
  // Edit Milestone
  updateProjet(id:string):any{
    localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
    localStorage.setItem('perPage', this.perPage)
    this.router.navigate([`/project-management/project-details/add-milestone/${this.projectId}/${id}`]);
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


