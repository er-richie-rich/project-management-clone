import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import {PMHelperService} from 'src/services/PMHelper.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class UserChangePasswordComponent implements OnInit {
  userChangePasswordForm: any = FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private apiService: PMApiServicesService,
    private router: Router,
    public route: ActivatedRoute,
    public helper: PMHelperService
  ) {
    this.createForm()
  }
  createForm() {
    const id: any = this.route.snapshot.paramMap.get('id');
    this.userChangePasswordForm = this._formBuilder.group({
      userId: [id],
      newpassword: [''],
      confirmPassword: [''],
    },
      { validator: this.checkIfMatchingPasswords('newpassword', 'confirmPassword') },
    );
  }
  ngOnInit() {
  }
  spaceInPwd(event:any){
    if (event.target.selectionStart === 0 && event.code === 'Space' || event.code === 'Space' ){
      event.preventDefault();
    }
  }
  
  checkSpace(e:ClipboardEvent){
    let data = e.clipboardData
    let pestData = data?.getData('text')
    if(pestData?.includes(' ')){
      e.preventDefault();
    }
  }
  
  changePassword() {
    if (this.userChangePasswordForm.valid) {
      this.helper.toggleLoaderVisibility(true)
      this.apiService.userChangePassword(this.userChangePasswordForm.value).subscribe((data: any) => {
        swal.fire(
          '',
          data.meta.message,
          'success'
        ).then();
        this.router.navigate(['/user-management']).then();
        this.helper.toggleLoaderVisibility(false)
      }, (err) => {
        const e = err.error;
        if (e.statusCode !== 401) {
          swal.fire(
            'Error!',
            err.error.message,
            'info'
          ).then();
        }
      });
    }
  }
  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (resetPasswordForm: FormGroup) => {
      let password = resetPasswordForm.controls[passwordKey],
        confirmPassword = resetPasswordForm.controls[passwordConfirmationKey];
      if (password.value !== confirmPassword.value) {
        return confirmPassword.setErrors({ notEquivalent: true });

      }
      else {
        return confirmPassword.setErrors(null);
      }
    }
  }

  
}
