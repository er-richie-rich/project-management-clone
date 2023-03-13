import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import swal from 'sweetalert2';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import {CancelDeletePopupComponent} from "../../../popup/cancel-delete-popup/cancel-delete-popup.component";
@Component({
  selector: 'app-employee-management-detail',
  templateUrl: './employee-management-detail.component.html',
  styleUrls: ['./employee-management-detail.component.scss']
})
export class EmployeeManagementDetailComponent implements OnInit {
  userData: any = {};
  userId: string | null = "0";
  id: any = 0;
  userIdProof:any;
  url: any = "assets/images/profile-picture-default.png";
  constructor(
    private apiService: PMApiServicesService,
    private router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private modle: NgbModal,
    @Inject(DOCUMENT) private doc: Document,
  ) {


  }
  ngOnInit(): void {
    this.doc.body.classList.add('custom-modal-width');
    const id: any = this.route.snapshot.paramMap.get('id');
    this.userId = id;

    this.apiService.getUser(id).subscribe((data: any) => {
      this.userData = data.data;
      this.userIdProof=data.data.idProofFiles;
    });
  }
  confirmDelete() {
    const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
      width: "500px",
      data: { message: 'Are you sure you want to delete this Employee?',key:"Delete Employee",icon:"delete-icon.png" }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        this.apiService.deleteUser(this.userId).subscribe(data => {
          this.router.navigate(['/employee-management']);
          swal.fire(
            'Deleted!',
            data.metaMassgae,
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

  openTemplate(content: any) {
    if (content) {
      this.modle.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any) => {
        if (result) {
        }
        // this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  backToEmployeeList(){
    this.setIsClicked()
    this.router.navigate(['/employee-management']).then();
  }
  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }

}
