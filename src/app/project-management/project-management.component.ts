import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { PopupConfirmDeleteComponent } from "../popup/popup-confirm-delete/popup-confirm-delete.component";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from "@angular/common/http";
import {PMApiServicesService} from "../../services/PMApiServices.service";
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {DatePipe} from "@angular/common";
import {saveAs} from "file-saver";
import {salesLead} from "../sales-management/sales-management.component";
import {PopupImportInquiryComponent} from "../popup/popup-import-inquiry/popup-import-inquiry.component";
import Swal from "sweetalert2";
import {PMHelperService} from "../../services/PMHelper.service";
//
// interface DataObject {
//   [key: string]: any
// }
//


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
  //////////////////////////////////////////////////////////////////
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
 /* masterToggle = ($event: any) => {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: projects) => this.selection.select(row));
  }*/

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
    const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Project?'}
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
      const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
        width: "500px",
        data: {message: 'Are you sure you want to delete this Projects?'}
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

  // Export Data
  /*Note need api for export project data*/
  /*exportAllProject = () => {
    this.apiService.exportAllInquiry({}).subscribe(
      data => {
        if (data && data?.meta) {
          if (data.meta.status == 1) {
            this.url = data.data.url;
            const date = new DatePipe('en-US').transform(new Date(), 'ddMMyy');
            const filename = 'inquiry_' + date + '.xlsx';
            saveAs.saveAs(this.url, filename);
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            swal.fire(
              'Exported!',
              data.meta.message,
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
  }*/
  // Import Data
  /*importProjectData = () => {
    const dialogRef = this.dialog.open(PopupImportInquiryComponent, {
      width: "600px",
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      const formData = new FormData();
      formData.append("file", result)
      this.apiService.importAllInquiry(formData).subscribe(
        data => {
          if (data && data?.meta) {
            if (data.meta.status == 1) {
              this.dataSource = new MatTableDataSource(this.dataSource.data);
              let metaData: any = data.meta.message;
              this.getProjectList({});
              swal.fire(
                'File Import Successfully!',
                metaData,
                'success'
              ).then();
            } else {
              swal.fire(
                'Error!',
                data.meta.message,
                'error'
              ).then();
            }
          } else {
            Swal.fire(
              'Error!',
              "Server Error",
              'error'
            ).then();
          }
        }
      )
    })
  }*/
}







// import {Component, OnInit, ViewChild} from '@angular/core';
// import {PMApiServicesService} from 'src/services/PMApiServices.service';
// import {MatPaginator} from '@angular/material/paginator';
// import {MatSort, Sort} from '@angular/material/sort';
// import {Subject} from 'rxjs';
// import {PopupConfirmDeleteComponent} from '../popup/popup-confirm-delete/popup-confirm-delete.component';
// import {MatDialog} from '@angular/material/dialog';
// import swal from 'sweetalert2';
// import {MatTableDataSource} from '@angular/material/table';
// import {ActivatedRoute, Router} from '@angular/router';
// import {debounceTime} from 'rxjs/operators';
// import {FormControl} from "@angular/forms";
// import {SelectionModel} from "@angular/cdk/collections";
// import {DatePipe} from "@angular/common";
// import {saveAs} from "file-saver";
// import {salesLead} from "../sales-management/sales-management.component";
//
// interface DataObject {
//   [key: string]: any
// }
//
// @Component({
//   selector: 'app-project-management',
//   templateUrl: './project-management.component.html',
//   styleUrls: ['./project-management.component.scss'],
// })
// export class ProjectManagementComponent implements OnInit {
//   projectsColumns: string[] = [
//     'selectAll',
//     'action2',
//     'projectCode',
//     'projectName',
//     'clientName',
//     'manager',
//     'startDate',
//     'technology',
//     'projectStatus',
//     // 'view_more',
//     // 'action',
//   ];
//   public requestPara = {};
//   public current_page = 1;
//   public limit = 25;
//   public filter: any;
//   projectStatus :any;
//   loadData: any = true;
//   projectDataSource: any = new MatTableDataSource([]);
//
//   @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
//   @ViewChild(MatSort) sort: MatSort | undefined;
//
//   private subject: Subject<string> = new Subject();
//   selectedValue: any = 'All';
//   toppings = new FormControl('');
//   toppingList: any[] =
//     [
//       {name: 'All', value: 'All'},
//       {name: 'In Progress', value: 'InProgress'},
//       {name: 'Completed', value: 'Completed'},
//       {name: 'On Hold', value: 'OnHold'}
//     ]
//
//   selectedLeadId: any;
//
//   constructor(
//     private apiService: PMApiServicesService,
//     public dialog: MatDialog,
//     public activatedRoute: ActivatedRoute,
//     private router: Router
//   ) {
//     this.projectStatus = this.activatedRoute.snapshot.queryParamMap.get("project");
//     console.log("this.projectStatus",this.projectStatus)
//     if (this.projectStatus === 'all') {
//       this.selectedValue = 'all';
//     } else if (this.projectStatus === 'in progress') {
//       this.selectedValue = 'in progress';
//     } else if (this.projectStatus === 'completed') {
//       this.selectedValue = 'completed';
//     } else if (this.projectStatus === 'on hold') {
//       this.selectedValue = 'on hold';
//     }
//
//     /*projectStatus
//
//     all, in progress, completed, on hold*!/*/
//   }
//
//   ngOnInit(): void {
//     this.loadData = true;
//     this.getProjectList({page: 1, limit: 25});
//     this.subject.pipe(debounceTime(500)).subscribe((searchTextValue) => {
//       console.log('Search text', searchTextValue);
//       this.applyFilter(searchTextValue);
//     });
//   }
//
//   filterByLeadStatus = (value: any) => {
//     this.selectedValue = value;
//   }
//
//   //for serching
//   onKeyUp(event: any) {
//     this.current_page = 1;
//     this.subject.next(event.target.value);
//     console.log('Search change', event.target.value);
//   }
//
//   applyFilter(filterValue: string) {
//     if (filterValue) {
//       filterValue = filterValue.trim();
//       filterValue = filterValue.toLowerCase();
//     }
//
//     this.filter = filterValue;
//     this.projectDataSource.data = [];
//     console.log('Table data',)
//     this.requestPara = {
//       searchKey: filterValue,
//       limit: this.limit,
//       page: this.current_page,
//     };
//     this.getProjectList(this.requestPara);
//   }
//
//   getProjectList(req: any): any {
//     if (this.loadData) {
//       this.apiService.listProject(req).subscribe((data: any) => {
//         //this.projectDataSource = data.data;
//         let listData = data.data;
//
//         this.loadData = listData.length > 0;
//         listData.forEach((b: any) => {
//           this.projectDataSource.data.push(b);
//         });
//         this.projectDataSource = new MatTableDataSource(
//           this.projectDataSource.data
//         );
//         this.projectDataSource.paginator = this.paginator;
//       });
//     }
//   }
//
//   ngOnDestroy() {
//     this.subject.next();
//     this.subject.complete();
//   }
//
//   updateProjet(id: any): any {
//     this.router.navigate(['/project-management/add-edit-project/' + id]);
//   }
//
//   viewProjet(id: any): any {
//     this.router.navigate([
//       'project-management/project-details/project-data/' + id,
//     ]);
//   }
//
//   deleteProject(id: any, index: number, event: any): any {
//     const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
//       width: '500px',
//       data: {message: 'Are you sure you want to delete this Project?'},
//     });
//     dialogRef.afterClosed().subscribe((result) => {
//       if (result) {
//         this.apiService.deleteProject(id).subscribe(
//           (data: any) => {
//             let metaData: any = data.meta.message;
//             this.projectDataSource.data.splice(index, 1);
//             this.projectDataSource = new MatTableDataSource(
//               this.projectDataSource.data
//             );
//
//             swal.fire('Deleted!', metaData, 'success');
//           },
//           (err: any) => {
//             const e = err.error;
//             if (e.statusCode !== 401) {
//               swal.fire('Error!', err.error.message, 'info');
//             }
//           }
//         );
//       }
//     });
//   }
//
//   projectSortChange(sortState: Sort) {
//     if (sortState.direction) {
//       console.log('Sorting list asending--', sortState.direction);
//     } else {
//       console.log('Sorting list decending--');
//     }
//   }
//
//
//
//   //////////////////////////////////////////////////////////////////
//   selection = new SelectionModel<salesLead>(true, []);
//
//   /** Whether the number of selected elements matches the total number of rows. */
//   isAllSelected = () => {
//     const numSelected = this.selection.selected.length;
//     const numRows = this.projectDataSource.data.length;
//     this.selectedLeadId = this.projectDataSource.data.filter((e: salesLead) => this.selection.isSelected(e)).map((e: { leadId: any; }) => e.leadId);
//     return numSelected === numRows;
//   }
//
//   /** Selects all rows if they are not all selected; otherwise clear selection. */
//   masterToggle = ($event: any) => {
//     // console.log($event)
//     this.isAllSelected()
//       ? this.selection.clear()
//       : this.projectDataSource.data.forEach((row: salesLead) => this.selection.select(row));
//   }
//
//   /////////////////////////////////////////////////////////////////
//
//
// }


