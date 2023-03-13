import { Component, OnInit, ViewChild } from '@angular/core';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import {CdkDragDrop,moveItemInArray,transferArrayItem,} from '@angular/cdk/drag-drop';
import { PopupTaskListComponent } from 'src/app/popup/popup-task-list/popup-task-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { PopupTaskCardComponent } from 'src/app/popup/popup-task-card/popup-task-card.component';
import swal from 'sweetalert2';
import {PMHelperService} from "../../../../../services/PMHelper.service";
import {CancelDeletePopupComponent} from "../../../../popup/cancel-delete-popup/cancel-delete-popup.component";

@Component({
  selector: 'app-task-manage',
  templateUrl: './task-manage.component.html',
  styleUrls: ['./task-manage.component.scss'],
})
export class TaskManageComponent implements OnInit {
  projectId: string | null = "0";
  listCardId: string | null = "0";

  allTaskListData : any = [];
  loadData: any = true;
  obs: Subscription = new Subscription;
  taskListId : any = true;
  tasks : any;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  allToDO = ['Add Child Screen', 'Camera Functionality'];
  allInPending = ['Recognizing Processing Time During Onboarding.'];

  constructor(
    private router: Router,
    private apiService: PMApiServicesService,
    public route: ActivatedRoute,
    public dialog : MatDialog,
    public helper:PMHelperService
  ) {
    this.projectId = this.route.snapshot.paramMap.get('id') || null;
  }

  ngOnInit(): void {
    this.helper.removeIsClicked()
    this.getTaskList({projectId:this.projectId});
  }

  /* Get Task List */
  getTaskList(req: any): any {
    this.apiService.listTaskApi(req).subscribe((data: any) => {
      this.allTaskListData = data.data;
    });
  }

  /* Add Task In List */
  addTaskInList(projectId: any) {
    const dialogRef = this.dialog.open(PopupTaskListComponent,{
      width : "500px",
      data: {
        projectId: projectId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.result){
        this.getTaskList({projectId:this.projectId});
        this.allTaskListData.unshift(result.data);
      }
    });
  }

  /* Edit Task */
  editTaskInList(data : any, index : any){
    const dialogRef = this.dialog.open(PopupTaskListComponent, {
      width: "500px",
      data: {
        projectId: data.projectId,
        index : index,
        taskListId : data._id
      }
    });
    dialogRef.afterClosed().subscribe( result => {
      if(result){
        this.getTaskList({projectId:this.projectId});
      }
    });
  }

  /* Delete Task */
  deleteTaskFromList(id: any, index: any, event : any){
    const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
      width: "500px",
      data: { message: 'Are you sure you want to delete this List Task?' ,key:"Delete Task",icon:"delete-icon.png"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteListTaskApi(id).subscribe(data =>{
          let metaData: any = data.meta.message;
          this.allTaskListData.splice(index, 1);
          swal.fire(
            'Deleted!',
            metaData,
            'success'
          );
        }, (err: any) => {
          const e = err.error;
          if (e.statusCode !== 401) {
            swal.fire(
              'Error!',
              err.error.message,
              'info'
            );
          }
        });
      }
    });
  }

  /* Add Card In List */
  addCardInList(data : any) {
    const dialogRef = this.dialog.open(PopupTaskCardComponent,{
      width : "500px",
      data :{
        taskListId : data._id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.result){
        this.getTaskList({projectId:this.projectId});
      }
    });
  }

  /* Edit Card */
  editCardInTask(data : any, index : any){
    const dialogRef = this.dialog.open(PopupTaskCardComponent, {
      width : "500px",
      data :{
        listCardId : data._id,
        index: index
      }
    });
    dialogRef.afterClosed().subscribe( result => {
      if(result){
        this.getTaskList({projectId:this.projectId});
      }
    });
  }

   /* delete Card */
  deleteCardFromTask(id: any, index: any, childIndex : any, event : any){
    const dialogRef = this.dialog.open(CancelDeletePopupComponent,{
      width : "500px",
      data: { message: 'Are you sure you want to delete this Card?' ,key:"Delete Card",icon:"delete-icon.png"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteCardTaskApi(id).subscribe(data =>{
          let metaData: any = data.meta.message;
          this.allTaskListData[index].listCards.splice(childIndex, 1);
          swal.fire(
            'Deleted!',
            metaData,
            'success'
          );
        }, (err: any) => {
          const e = err.error;
          if (e.statusCode !== 401) {
            swal.fire(
              'Error!',
              err.error.message,
              'info'
            );
          }
        });
      }
    });
  }

  /* List Drag and Drop */
  dropList(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allTaskListData, event.previousIndex, event.currentIndex);
    event.container.data.forEach((item:any,i:number)=>{
      item.sortOrder = i;
      return item;
    });
    this.apiService.changeListSortOrderApi(event.container.data).subscribe((data: any) => {
      //this.gridResourceData = data.data[0].list;
      //this.dataSource = data.data.list;
    }, err => {
      //this.toastr.error(err, 'Error');
    });
  }

  /* Card Drag and Drop */
  dropCard(event: CdkDragDrop<string[]>, list:Array<any>){
    const foundParent = list.filter((elem)=>elem._id === event.container.id)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      event.container.data.forEach((item:any,i:number)=>{
        item.sortOrder = i;
        return item;
      });
      this.apiService.changeSortOrderApi(event.container.data).subscribe((data: any) => {
        //this.gridResourceData = data.data[0].list;
        //this.dataSource = data.data.list;
      }, err => {
        //this.toastr.error(err, 'Error');
      });
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        event.container.data.forEach((item:any, i:number)=>{
          item.taskListId = foundParent[0]._id;
          item.sortOrder = i;
          return item;
        })
      this.apiService.changeSortOrderApi(event.container.data).subscribe((data: any) => {
        //this.gridResourceData = data.data[0].list;
        //this.dataSource = data.data.list;
      }, err => {
        //this.toastr.error(err, 'Error');
      });
    }
  }

  getConnectedList(){
    return this.allTaskListData.map((x: any) => `${x._id}`);
  }
}
