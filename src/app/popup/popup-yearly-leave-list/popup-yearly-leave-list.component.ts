import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {SelectionModel} from "@angular/cdk/collections";
import {activities} from "../popup-today-activities/popup-today-activities.component";
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PMApiServicesService} from "../../../services/PMApiServices.service";

@Component({
  selector: 'app-popup-yearly-leave-list',
  templateUrl: './popup-yearly-leave-list.component.html',
  styleUrls: ['./popup-yearly-leave-list.component.scss']
})
export class PopupYearlyLeaveListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5,10];
  size: any = 10;
  perPage: any = 5;
  count:number=0;
  currentPage = 1;
  dataObj:any = {}
  listingData:any
  leaveList: any = new MatTableDataSource([]);
  selection = new SelectionModel<activities>(true, []);
  leaveListColumns: string[] = ['fullName','email','department'];
  constructor(
      public dialogRef: MatDialogRef<PopupYearlyLeaveListComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private apiService:PMApiServicesService,
  ) { }

  ngOnInit(): void {
    this.getYearlyLeaveList()
  }

  pageChange = (obj: any) => {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.getYearlyLeaveList()
  }

  getYearlyLeaveList(){
    this.dataObj = {
      page:this.currentPage,
      limit:this.perPage,
      leaveStatus:this.data.key
    }
    this.apiService.getYearlyLeaveList(this.dataObj).subscribe((result:any)=>{
      if(result.meta.status === 1){
        this.count = result.meta.totalCount
        this.listingData = result.data
        this.leaveList = new MatTableDataSource<activities>(this.listingData)
      }
    })
  }
  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

}
