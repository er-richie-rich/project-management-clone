import { Component, OnInit } from '@angular/core';
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {PopupConfirmDeleteComponent} from "../../popup/popup-confirm-delete/popup-confirm-delete.component";
import swal from "sweetalert2";

@Component({
  selector: 'app-department-management-detail',
  templateUrl: './department-management-detail.component.html',
  styleUrls: ['./department-management-detail.component.scss']
})
export class DepartmentManagementDetailComponent implements OnInit {
  _departmentId:any;
  departmentData:any = {};
  constructor(
      private apiService: PMApiServicesService,
      public route: ActivatedRoute,
      public dialog: MatDialog,
      private router: Router,
  ) { }

  ngOnInit(): void {
    const id: any = this.route.snapshot.paramMap.get('id');
    this._departmentId = id
    this.apiService.getDepartment(id).subscribe((data: any) => {
      if(data.meta.status === 1){
        this.departmentData = data.data;
      }
    });
  }

  deleteDepartment(){
    const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Department?'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteDepartment(this._departmentId).subscribe(
            data => {
              swal.fire(
                  'Deleted!',
                  data.metaMassgae,
                  'success'
              ).then(()=>{
                this.setIsClicked()
                this.router.navigate(['/department-management']);
              });
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
    })
  }

  goToDepartmentList(){
    this.setIsClicked()
    this.router.navigate(['/department-management/']).then();
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }

}
