import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {PopupAddLeaveComponent} from "../../popup/popup-add-leave/popup-add-leave.component";
import swal from "sweetalert2";
import {MatDialog} from "@angular/material/dialog";
import {PopupAddReportInventoryComponent} from "../../popup/popup-add-report-inventory/popup-add-report-inventory.component";

@Component({
  selector: 'app-view-my-report',
  templateUrl: './view-my-report.component.html',
  styleUrls: ['./view-my-report.component.scss']
})
export class ViewMyReportComponent implements OnInit {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  isVisible: boolean = false;
  search:any;
  userData:any;
  inventoryId:any;
  constructor(private apiService: PMApiServicesService,public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.apiService.getUserInventoryId().subscribe((data:any)=>{
      this.userData = data.data
      this.inventoryId = this.userData.inventoryId
    })
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
    }
  }
  clearSearch = () => {
    this.paginator.firstPage();
    this.searchString.nativeElement.value = '';
    if (this.searchString.nativeElement.value === '') {
      this.isVisible = false;
      this.search = '';
    }
  }

  addReport(){
    const dialogRef = this.dialog.open(PopupAddReportInventoryComponent, {
      width: "500px",
      data: { inventoryId: this.inventoryId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.getReportList({});
        swal.fire({
          icon: 'error',
          title: result.data.meta.message,
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }
}
