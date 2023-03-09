import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/services/auth-service.service';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import swal from 'sweetalert2';
import {Location} from "@angular/common";
import {PMHelperService} from "../../../../../services/PMHelper.service";

@Component({
  selector: 'app-add-change-request',
  templateUrl: './add-change-request.component.html',
  styleUrls: ['./add-change-request.component.scss']
})
export class AddChangeRequestComponent implements OnInit {

  addChangeReqForm: FormGroup;
  editMode : string = "New";
  projectId: string | null = "0";
  requestId: string | null = "0";

  constructor(
    private _formBuilder: FormBuilder,
    public apiService : PMApiServicesService,
    public router: Router,
    public route: ActivatedRoute,
    private location:Location,
    public helper:PMHelperService
  ) {
    this.projectId = this.route.snapshot.paramMap.get('id') || null;
    this.requestId = this.route.snapshot.paramMap.get('requestId')|| null;


    this.addChangeReqForm = this._formBuilder.group({
      projectId: [this.projectId],
      title: ['',Validators.required],
      version: ['',Validators.required],
      estimation: ['',Validators.required],
      receiveDate:['',Validators.required],
      description:['',Validators.required],
      changeRequestId:[],
    });

    if(this.requestId != "0"){
      this.editMode = "Edit";
      this.apiService.viewChangeRequestApi({changeRequestId : this.requestId}).subscribe((data:any) =>{
        let changeRequestData =  data.data;
        this.addChangeReqForm.patchValue({
          title : changeRequestData.title,
          version : changeRequestData.version,
          estimation : changeRequestData.estimation,
          receiveDate : changeRequestData.receiveDate,
          description : changeRequestData.description,
          changeRequestId:changeRequestData._id
        });
      })
    }
  }

  ngOnInit(): void {
    this.helper.removeIsClicked()
  }

  addNewChangeRequest(): any {
    if (this.addChangeReqForm.valid) {
      this.apiService.addEditChangeRequestApi(this.addChangeReqForm.value).subscribe((data: any) => {
        // this.router.navigate(['project-management/project-details/change-request/' + this.projectId]);
          if (data.meta.status === 1){
            this.setIsClicked()
            this.router.navigate(['project-management/project-details/project-data/' + this.projectId]);
            swal.fire('', data.meta.message, 'success');
          } else {
            swal.fire('Error!', data.meta.message, 'info');
          }
      }, (err) => {
        swal.fire('Error!', err.error.message, 'info');
      }
      );
    }
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

  back(){
    this.setIsClicked()
    this.location.back()
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }
}
