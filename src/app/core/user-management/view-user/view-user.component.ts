import {Component, OnInit} from '@angular/core';
import {PMApiServicesService} from "../../../../services/PMApiServices.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import swal from "sweetalert2";
import {Location} from "@angular/common";
import {CancelDeletePopupComponent} from "../../../popup/cancel-delete-popup/cancel-delete-popup.component";

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
  userDetail: any;
  userId: any;
  empCode: any;
  email: any;
  mobileNumber: any;
  userRole: any;
  profileImage: any;
  fullName: any;
  isActiveTab:number=0;
  constructor(
    private apiService: PMApiServicesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private location:Location
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
        this.userId = params.id;
      }
    )
    this.getUserData()
    this.isActiveTab=0;
  }

  getUserData = () => {
    this.apiService.getUserdetail({userId:this.userId}).subscribe(
      data => {
        if (data && data?.meta) {
          if (data.meta.status == 1) {
            this.userDetail = data.data;
            // console.log('userDetail', this.userDetail)
            this.fullName = this.userDetail?.fullName;
            this.empCode = this.userDetail?.empCode;
            this.email = this.userDetail?.email;
            this.mobileNumber = this.userDetail?.mobileNumber;
            this.userRole = this.userDetail?.roleName;
            this.profileImage = this.userDetail?.profileImage;
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

  //Delete User
  deleteUser(userId: any): any {
    const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this User?',key:"Delete User",icon:"delete-icon.png"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteUser(userId).subscribe(data => {
          if (data && data?.meta) {
            if (data.meta.status == 1) {
              let metaData: any = data.meta.message;
              swal.fire(
                  'Deleted!',
                  metaData,
                  'success'
              ).then(() => {
                this.setIsClicked()
                this.router.navigate(['user-management']);
              });
            } else {
              swal.fire(
                  '',
                  data.meta.message,
                  'error'
              );
            }
          } else {
            swal.fire(
                'Error!',
                "Server Error",
                'error'
            );
          }
          // this.userDataSource.data.splice(index, 1);
          // this.userDataSource = new MatTableDataSource(this.userDataSource.data);
        });
      }
    });
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }

  backToUserList(){
    this.setIsClicked()
    this.location.back()
  }
}
