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
import {PopupConfirmDeleteComponent} from 'src/app/popup/popup-confirm-delete/popup-confirm-delete.component';
import {PMHelperService} from "../../../../services/PMHelper.service";

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
  //////////////////////////////////////////////////////////////////
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
    const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Project?'}
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

// import { Component, OnInit, ViewChild } from '@angular/core';
// import { PMApiServicesService } from 'src/services/PMApiServices.service';
// import swal from 'sweetalert2';
// import {  Subscription } from 'rxjs';
// import { Router, ActivatedRoute } from '@angular/router';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatDialog } from '@angular/material/dialog';
// import { PopupConfirmDeleteComponent } from 'src/app/popup/popup-confirm-delete/popup-confirm-delete.component';
//
//
// @Component({
//   selector: 'app-project-data',
//   templateUrl: './project-data.component.html',
//   styleUrls: ['./project-data.component.scss']
// })
// export class ProjectDataComponent implements OnInit {
//
//   projectCode: any = [];
//   projectDescription: any = [];
//   projectName: any = [];
//   projectData:any=[];
//   milestoneDataID:any=[{}];
//   obs: Subscription = new Subscription;
//   projectId: string | null = "0";
//   milestoneColumns: string[] = ['title', 'expectedDate', 'milestoneStatus', 'action'];
//   milestoneData :any = new MatTableDataSource([]);
//   @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
//   @ViewChild(MatSort) sort: MatSort | undefined;
//
//   constructor(private router: Router,
//     private apiService: PMApiServicesService,
//     public route: ActivatedRoute,
//     public dialog: MatDialog) {
//     this.projectId = this.route.snapshot.paramMap.get('id')|| null;
//   }
//
//
//   // viewProjetDetails(): any {
//   //   this.router.navigate(['/project-management/project-details/project-data/' + this.isview]);
//   // }
//   // viewTaskDetails():any{
//   //   this.router.navigate(['/project-management/project-details/task-manage/' +this.isview]);
//   // }
//   // viewFilesDetails():any{
//   //   this.router.navigate(['/project-management/project-details/files-manage/' +this.isview]);
//   // }
//   // viewchangerequestDetails():any{
//   //   this.router.navigate(['/project-management/project-details/change-request/' +this.isview]);
//   // }
//   ngOnInit(): void {
//     this.listOfMilestone({ page: 1,limit:10,projectId:this.projectId});
//     this.viewProjectDetailsApi(this.projectId);
//   }
//   updateProjet(id:string):any{
//     this.router.navigate([`/project-management/project-details/add-milestone/${this.projectId}/${id}`]);
//   }
//    deleteProject(id: any, index: number, event: any): any {
//     const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
//       width: "500px",
//       data: { message: 'Are you sure you want to delete this Project?' }
//     });
//     dialogRef.afterClosed().subscribe(result => {
//
//       if (result) {
//         this.apiService.deleteMilestone(id).subscribe((data: any) => {
//           let metaData: any =data.meta.message;
//           this.milestoneData.data.splice(index, 1);
//           this.milestoneData = new MatTableDataSource(this.milestoneData.data);
//
//           swal.fire(
//             'Deleted!',
//             metaData,
//             'success'
//           );
//         }, (err: any) => {
//           const e = err.error;
//           if (e.statusCode !== 401) {
//             swal.fire(
//               'Error!',
//               err.error.message,
//               'info'
//             );
//           }
//         });
//       }
//     });
//   }
//   viewProjectDetailsApi(id: any) {
//     this.obs = this.apiService.getProject(id).subscribe((data: any) => {
//      this.projectData=data.data;
//       this.projectCode = data.data.projectCode;
//       this.projectDescription = data.data.projectDescription;
//       this.projectName = data.data.projectName;
//     }, data => {
//       swal.fire('Error!', data.meta.message, 'info');
//     });
//   }
//
//
//   listOfMilestone(req: any){
//     this.apiService.listMilestone(req).subscribe((data:any)=>{
//
//     //let listData=data.data;
//     this.milestoneData= new MatTableDataSource(data.data);
//
//     //let mId=this.milestoneData._id;
//
//     // this.loadData = (listData.length > 0);
//     // listData.forEach((b: any) => {
//     //   this.projectDataSource.data.push(b);
//     //   });
//     // this.milestoneData = new MatTableDataSource(this.milestoneData.data);
//     // this.milestoneData.paginator = this.paginator;
//
//     })
//   }
//   ngOnDestroy() {
//     this.obs.unsubscribe();
//   }
//
//
//
//
//
// }
//
