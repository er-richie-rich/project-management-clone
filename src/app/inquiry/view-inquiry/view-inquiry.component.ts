import {Component, OnInit} from '@angular/core';
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {inquiry} from "../inquiry.component";
import {PopupConfirmDeleteComponent} from "../../popup/popup-confirm-delete/popup-confirm-delete.component";
import swal from "sweetalert2";
import {Location} from "@angular/common";

@Component({
  selector: 'app-view-inquiry',
  templateUrl: './view-inquiry.component.html',
  styleUrls: ['./view-inquiry.component.scss']
})
export class ViewInquiryComponent implements OnInit {
  inquiryId: any;
  inquiry: any;
  serviceType: any;
  fullName: any;
  email: any;
  contactNo: any;
  additionalInfo: any;
  documents: any;

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
        this.inquiryId = params.id;
      }
    )
    this.inquiryDetail()
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }

  backToInquiry(){
    this.setIsClicked()
    this.location.back()
  }

  // Delete Lead
  deleteItem = () => {
    const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this inquiry?'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteInquiryLists({id: this.inquiryId}).subscribe(
          data => {
            if (data && data?.meta) {
              if (data.meta.status == 1) {
                let metaData: any = data.meta.message;
                swal.fire(
                  'Deleted!',
                  metaData,
                  'success'
                ).then();
                this.setIsClicked()
                this.router.navigate([`/inquiry/`]).then()
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

  // Inquiry Detail
  inquiryDetail = () => {
    this.apiService.inquiryDetail({id: this.inquiryId}).subscribe(
      (data) => {
        this.inquiry = data.data;
        this.serviceType = this.inquiry.service_type;
        this.fullName = this.inquiry.full_name;
        this.email = this.inquiry.email;
        this.contactNo = this.inquiry.contact_no;
        this.additionalInfo = this.inquiry.additional_info;
        this.documents = this.inquiry.file;
      },
      () => {
      },
      () => {
      }
    )
  }

  //Download File
  downloadFile = ($event: any) => {
    window.open($event, '_blank');
  }

}
