import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import swal from 'sweetalert2'
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import { ActivatedRoute,Router } from '@angular/router';
import {PMHelperService} from "../../../services/PMHelper.service";
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm:FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    private _location: Location,
    private apiService:PMApiServicesService,
    private router:Router,
    private activeRouter: ActivatedRoute,
    private helper : PMHelperService

  ) {
    const token: any = this.activeRouter.snapshot.paramMap.get('token');
    this.resetPasswordForm=this.formBuilder.group({
      token: [token],
      newPassword:[''],
      confirmPassword:['']
    },
    {validator: this.checkIfMatchingPasswords('newPassword', 'confirmPassword')},
    );


  }

  ngOnInit(): void {
  }
  OnResetPass(): void {
    if (this.resetPasswordForm.valid) {
      this.helper.toggleLoaderVisibility(true)
      this.apiService.resetPassword(this.resetPasswordForm.value).subscribe((data: any) => {
        // Register the navigation to the service
        this.router.navigate(['/']);
        if (data.meta.status === 1){
          swal.fire('', data.meta.message, 'success');
        } else {
          swal.fire('Error!', data.meta.message, 'info');
        }
        this.helper.toggleLoaderVisibility(false)
      }, (err) => {
        const e = err.message;
        if (e.statusCode !== 401) {
          swal.fire(
            'Error!',
            e,
            'info'
          );
        }
      });
    }
  }

  backClicked(){
    this._location.back();
  }
  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (resetPasswordForm: FormGroup) => {
      let password = resetPasswordForm.controls[passwordKey],
      confirmPassword = resetPasswordForm.controls[passwordConfirmationKey];
      if (password.value !== confirmPassword.value) {
         return confirmPassword.setErrors({notEquivalent: true});

      }
      else {
            return confirmPassword.setErrors(null);


      }
    }
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
