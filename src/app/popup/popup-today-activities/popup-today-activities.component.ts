import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";


export interface activities {
  fullName: string;
  email: string;
  department:string;
}

@Component({
  selector: 'app-popup-today-activities',
  templateUrl: './popup-today-activities.component.html',
  styleUrls: ['./popup-today-activities.component.scss']
})
export class PopupTodayActivitiesComponent implements OnInit {
  activityData:any;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5,10];
  size: any = 10;
  perPage: any = 5;
  currentPage = 1;
  count:number=0;
  dataObj:any = {}
  activity: any = new MatTableDataSource([]);
  userListColumns: string[] = ['fullName','email','department'];
  selection = new SelectionModel<activities>(true, []);
  constructor(
      public dialogRef: MatDialogRef<PopupTodayActivitiesComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private apiService:PMApiServicesService,
  ) { }

  ngOnInit(): void {
    this.getActivties()
  }

  getActivties(){
    this.dataObj = {
      page:this.currentPage,
      limit:this.perPage
    }
    if(this.data.key === "Leaves"){
      this.userListColumns = ['fullName','email','department','leaveDurationDetail'];
      this.getTodayLeaveList()
    } else if(this.data.key === "Birthday"){
      this.getTodayBirthdayList()
    }else if(this.data.key === "probationPeriod"){
      this.getTodayProbationEndDateList()
    } else {
      this.getTodayAnniversaryList()
    }
  }

  getTodayLeaveList(){
    this.apiService.getTodayLeaveList(this.dataObj).subscribe((result:any)=>{
      if(result.meta.status === 1){
        console.log(result)
        this.count = result.meta.totalCount
        this.activityData = result.data
        this.activity = new MatTableDataSource<activities>(this.activityData)
      }
    })
  }
  getTodayBirthdayList(){
    this.apiService.getTodayBirthdayList(this.dataObj).subscribe((result:any)=>{
      if(result.meta.status === 1){
        this.count = result.meta.totalCount
        this.activityData = result.data
        this.activity = new MatTableDataSource<activities>(this.activityData)
      }
    })
  }
  getTodayAnniversaryList(){
    this.apiService.getTodayAnniversaryList(this.dataObj).subscribe((result:any)=>{
      if(result.meta.status === 1){
        this.count = result.meta.totalCount
        this.activityData = result.data
        this.activity = new MatTableDataSource<activities>(this.activityData)
      }
    })
  }

  getTodayProbationEndDateList(){
		this.apiService.probationDateEndList().subscribe((result:any) => {
          if(result.meta.status === 1){
            this.count = result.meta.totalCount
            this.activityData = result.data
            this.activity = new MatTableDataSource<activities>(this.activityData)
          }
		})
	}

  pageChange = (obj: any) => {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.getActivties()
  }
  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

}
