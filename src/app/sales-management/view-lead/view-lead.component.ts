import {Component, OnInit} from '@angular/core';
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import swal from "sweetalert2";
import {PopupConfirmDeleteComponent} from "../../popup/popup-confirm-delete/popup-confirm-delete.component";
import {MatDialog} from "@angular/material/dialog";
import {Location} from "@angular/common";

@Component({
  selector: 'app-view-lead',
  templateUrl: './view-lead.component.html',
  styleUrls: ['./view-lead.component.scss']
})
export class ViewLeadComponent implements OnInit {
  view: any;
  leadId: any;
  leadTitle: any;
  lead_generation_date: any;
  leadType: any;
  leadGeneratedByName: any;
  leadReviewedByName: any;
  clientCountry: any;
  leadSource: any;
  leadStatus: any;
  isHotLead: any;
  lead_created_date: any;
  ProfileUrlOfLinkedIn: any;
  nameOfClient: any;
  clientPhone: any;
  additionalInfo: any;
  emailOfClient: any;

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
        this.leadId = params.id;
      }
    )
    this.viewLead()
  }

  //View Detail of Lead
  viewLead = () => {
    this.apiService.viewSalesLeads({leadId: this.leadId}).subscribe(
      data => {
        if (data && data?.meta && data.meta.status == 1) {
          this.view = data.data;
          this.leadTitle = this.view.leadTitle;
          this.lead_created_date = this.view.createdAt;
          this.lead_generation_date = this.view.leadGenerationDate;
          this.leadType = this.view.leadType;
          this.leadGeneratedByName = this.view.leadGeneratedByName;
          this.leadReviewedByName = this.view.salesPersonName;
          this.clientCountry = this.view.clientCountry;
          this.nameOfClient = this.view.clientName;
          this.leadSource = this.view.leadSource;
          this.leadStatus = this.view.leadStatus;
          this.isHotLead = this.view.isHotLead;
          this.ProfileUrlOfLinkedIn = this.view.linkedinProfileUrl;
          this.clientPhone = this.view.clientPhoneNumber;
          this.additionalInfo = this.view.additionalNotes;
          this.emailOfClient = this.view.email;
        }
      }
    )
  }

  //Hot lead
  hotLead($event: MatSlideToggleChange) {
    this.apiService.salesHotLeadStatusUpdate({leadId: this.leadId, isHotLead: $event.checked}).subscribe(
      data => {
        if (data && data?.meta) {
          if (data.meta.status == 1) {
            swal.fire(
              '',
              data.meta.message,
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
          swal.fire(
            'Error!',
            "Server Error",
            'error'
          ).then();
        }
      }
    )
  }

  // Delete Lead
  deleteLeads = (event: any) => {
    const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Lead?'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteSalesLeads({leadId: this.leadId}).subscribe(
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
                this.router.navigate([`/sales-management/`]).then()
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

  //Edit Leads
  editLeads = (event: any) => {
    this.router.navigate(['sales-management/add-new-lead/' + this.leadId]).then();
  }

  backToLead(){
    this.setIsClicked()
    this.location.back()
    // this.router.navigate(['/sales-management']).then();
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }

}
