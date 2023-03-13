import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { SelectionModel } from '@angular/cdk/collections';
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {PMHelperService} from "../../../services/PMHelper.service";
import {CancelDeletePopupComponent} from "../../popup/cancel-delete-popup/cancel-delete-popup.component";


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
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.scss'],
})

export class ProjectManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild('clearString') clearString!: ElementRef;
  @ViewChild('hotLeads') hotLeads!: ElementRef;
  pageSizeOptions: number[] = [10,20,30,40,50,100];
  page = 1;
  size: any = 5;
  perPage: any = 10;
  currentPage = 1;
  requestBody: any = {};
  sortBy: any= -1;
  sortKey: any;
  projects: any;
  search: any;
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
  isDisabled: boolean = true;
  isVisible: boolean = false
  meta: any;
  selectedProjectId: any;
  url: any;
  projectStatus: any = 'all';
  displayedColumns: string[] = [
    'selectAll',
    'action2',
    'projectCode',
    'projectName',
    'clientName',
    'manager',
    'startDate',
    'technology',
    'projectStatus',
  ];
  selection = new SelectionModel<projects>(true, []);

  constructor(
    private apiService: PMApiServicesService,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private helper : PMHelperService
  ) {
    this.projectStatus = this.activatedRoute.snapshot.queryParamMap.get("project");
    if (this.projectStatus === 'all') {
      this.selectedValue = 'all';
    } else if (this.projectStatus === 'in progress') {
      this.selectedValue = 'in progress';
    } else if (this.projectStatus === 'completed') {
      this.selectedValue = 'completed';
    } else if (this.projectStatus === 'on hold') {
      this.selectedValue = 'on hold';
    }
  }

  ngOnInit(): void {
    this.helper.removeIsClicked()
    var data: DataObject = {};
    this.getProjectList(data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    localStorage.removeItem('selectedIndex')
    localStorage.removeItem('selectedIndexLabel')
  }

  // Get Project list
  getProjectList = (data: any) => {
    let perPage = localStorage.getItem('perPage')
    if(perPage){
      this.perPage = perPage;
    }
    data.page = this.currentPage;
    data.limit = this.perPage;
    if (this.selectedValue) {
      data.projectStatus = this.selectedValue;
    }
    if (this.sortBy && this.sortKey) {
      data.sortBy = this.sortBy;
      data.sortKey = this.sortKey;
    }
    if (this.search) {
      data.search = this.search;
    }
    this.helper.toggleLoaderVisibility(true)
    this.apiService.listProject(data).subscribe((data:any) => {
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
        this.meta === 0 ? this.isDisabled = true : this.isDisabled = false ;
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

  filterByLeadStatus = (value: any) => {
    this.selectedValue = value;
    this.getProjectList({});
  }

  // Filter for Search
  applyFilter(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    } else {
      this.paginator.firstPage();
      this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.isVisible = this.search !== '';
      this.getProjectList({});
    }
  }

  clearSearch = (event: any) => {
    this.paginator.firstPage();
    this.searchString.nativeElement.value = '';
    if (this.searchString.nativeElement.value === '') {
      this.isVisible = false;
      this.search = '';
    }
    this.getProjectList({});
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
    if($event.checked){
      this.dataSource.data.forEach((row: projects) => this.selection.select(row));
    } else {
      this.selection.clear()
      this.selectedProjectId = null
    }
  }

  pageChange = (obj: any) => {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.selection.clear()
    this.selectedProjectId = null
    this.getProjectList({});
  }

  // Delete Project
  deleteProject = (projectId: any) => {
    this.searchString.nativeElement.value = '';
    this.getProjectList({});
    const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Project?',key:"Delete Project",icon:"delete-icon.png"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteProject(projectId).subscribe(
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
                this.getProjectList({})
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

  // Edit Project
  editProject = (projectId: any) => {
    localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
    localStorage.setItem('perPage', this.perPage)
    this.router.navigate(['/project-management/add-edit-project/' + projectId]).then();
  }

  // View Project
  viewProject(id: any): any {
    this.router.navigate([ 'project-management/project-details/project-data/' + id, ]);
  }


  deleteRow = () => {
    if (this.selectedProjectId === null) {
      swal.fire(
        '',
        "Please select at least one row to delete",
        'info'
      ).then();
    } else {
      const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
        width: "500px",
        data: {message: 'Are you sure you want to delete this Projects?',key:"Delete Project",icon:"delete-icon.png"}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.apiService.deleteMultipleProject(this.selectedProjectId).subscribe(
            data => {
              if (data && data?.meta) {
                if (data.meta.status == 1) {
                  this.dataSource = new MatTableDataSource(this.dataSource.data);
                  let metaData: any = data.meta.message;
                  this.selection.clear();
                  swal.fire(
                    'Deleted!',
                    metaData,
                    'success'
                  ).then();
                  this.selection.clear();
                  this.getProjectList({})
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
        }
      })
    }
  }

  sortData(sortKey:any, sortBy:any){
    this.sortBy = (sortBy === -1) ? 1 : -1;
    this.sortKey = sortKey;
    this.getProjectList({});
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
