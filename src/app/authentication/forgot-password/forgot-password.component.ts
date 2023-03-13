import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AuthServiceService } from 'src/services/auth-service.service';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import { PMHelperService } from 'src/services/PMHelper.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm : FormGroup;
  constructor(
    private _formBuilder:FormBuilder,
    private _location: Location,
    private authService:AuthServiceService,
    private apiService:PMApiServicesService,
    private PMHelper:PMHelperService,
    private router:Router

  ) {
    this.forgotPasswordForm=this._formBuilder.group({
      email: [null, Validators.compose([Validators.required,Validators.email, Validators.maxLength(50),Validators.pattern('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$') ,])],
    })
   }

  ngOnInit(): void {
  }
  onforgotpassword(): void {
    if (this.forgotPasswordForm.valid) {

      this.apiService.forgotPassword(this.forgotPasswordForm.value).subscribe((data: any) => {
        // Register the navigation to the service
        PMHelperService.resetPasswordToken = data.data;

        this.router.navigate(['/']);
        swal.fire(
          '',
          data.meta.message,
          data.meta.status===0?'error':'success');



        });
    }
  }
  backClicked() {
    this._location.back();
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

}
