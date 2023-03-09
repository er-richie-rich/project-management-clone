import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PMApiServicesService} from "../../../../services/PMApiServices.service";
import {ActivatedRoute, Router} from "@angular/router";
import swal from "sweetalert2";
import {PMHelperService,noWhitespaceValidation} from "../../../../services/PMHelper.service";

@Component({
  selector: 'app-add-edit-holidays',
  templateUrl: './add-edit-holidays.component.html',
  styleUrls: ['./add-edit-holidays.component.scss']
})
export class AddEditHolidaysComponent implements OnInit {
  holidaysForm: any = FormGroup;
  editMode: string = "Add";
  constructor(private _formBuilder: FormBuilder,
              private apiService: PMApiServicesService,
              public route: ActivatedRoute,
              private router: Router,
              public helper:PMHelperService) {
    this.holidaysForm = this._formBuilder.group({
      holidayId:[''],
      holidayName: ['', [Validators.required, noWhitespaceValidation.noWhitespaceValidator]],
      holidayDate: ['', Validators.required],
    });

    const id: any = this.route.snapshot.paramMap.get('id');

    if (id != "0") {
      this.editMode = "Edit";
      this.apiService.viewHoliday(id).subscribe((data: any) => {
        if (data && data?.meta && data.meta.status == 1) {
          let holidaysData = data.data;
          this.holidaysForm.patchValue({
            holidayId: holidaysData.holidayId,
            holidayName: holidaysData.holidayName,
            holidayDate:new Date(holidaysData.holidayDate)
          });
        }
      }, err => {
        swal.fire('Error!', err.error.message, 'info').then();
      });
    }

  }

  ngOnInit(): void {
  }
  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

  AddHolidays(){
    if(this.holidaysForm.valid){
      this.apiService.addEditHolidays(this.holidaysForm.value).subscribe((data:any)=>{
        if (data.meta.status === 0){
          swal.fire('Error!', data.meta.message, 'info');
        } else {
          this.setIsClicked()
          this.router.navigate(['/holidays-management']);
          swal.fire('', data.meta.message, 'success');
        }
      }, (err) => {
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
  }

  goToholidays(){
    this.setIsClicked()
    this.router.navigate(['/holidays-management']).then();
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }
}
