import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import {PMHelperService} from 'src/services/PMHelper.service';
import swal from 'sweetalert2';
import {AuthServiceService} from 'src/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  obs: Subscription = new Subscription;
  email: any;
  password: any;

  constructor(
    private fb: FormBuilder,
    private apiService: PMApiServicesService,
    private router: Router,
    private authService: AuthServiceService,
    private helper: PMHelperService
  ) {
    let RememberMe: any = localStorage.getItem('RememberMe');
    let isRemberMeChecked = false;
    let password = null;
    let email = null;
    if (RememberMe) {
      RememberMe = JSON.parse(RememberMe);
      if (RememberMe && RememberMe.isRemberMeChecked) {
        isRemberMeChecked = true;
        email = RememberMe.email;
        password = RememberMe.password;
      }
    }
    this.loginForm = this.fb.group({
      email: [email, Validators.compose([Validators.required, Validators.email, Validators.maxLength(50), Validators.pattern('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$'),])],
      password: [password, Validators.required],
      isRemberMeChecked: [isRemberMeChecked]
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.obs.unsubscribe();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.obs = this.apiService.login(this.loginForm.value).subscribe((data: any) => {
        PMHelperService.responseMeta(data).then((data: any) => {
          //data divided
          let loginUser: any = data.data;
          PMHelperService.loginUserData = loginUser;
          PMHelperService.loginUserMetaData = data.meta;
          PMHelperService.loginUserID = data.data.userId;
          PMHelperService.userRole = data.data.roleKey;
          PMHelperService.roleName = data.data.roleName;
          //store data in localstorage
          localStorage.removeItem('tokenData');
          localStorage.removeItem('loggedInUser');
          localStorage.removeItem('loginId');
          localStorage.setItem('loggedInUser', JSON.stringify(loginUser));
          localStorage.setItem('loginId', PMHelperService.loginUserID);
          localStorage.setItem('tokenData', data.meta.tokenData);
          //remember ME logic
          if (this.loginForm.value.isRemberMeChecked) {
            localStorage.setItem('RememberMe', JSON.stringify(this.loginForm.value));
          } else {
            localStorage.removeItem('RememberMe');
          }
  
          'SUPERADMINS' === PMHelperService.userRole ||
          'SALESMANAGERS' === PMHelperService.userRole ||
          'BUSINESSDEVELOPMENTMANAGER' === PMHelperService.userRole ||
          'BUSINESSDEVELOPMENTEXECUTIVE' === PMHelperService.userRole ||
          'PROJECTMANAGERS' === PMHelperService.userRole ||
          'NETWORKENGINEER' === PMHelperService.userRole ||
          'TEAMLEADERS' === PMHelperService.userRole ||
          'TEAMMEMBERS' === PMHelperService.userRole

            ? this.router.navigate(['/dashboard']) : '';

          'HRMANAGERS' === PMHelperService.userRole ? this.router.navigate(['/hr-dashboard']) : '';
          // if (PMHelperService.userRole === "SUPERADMINS") {
          //   this.router.navigate(['/dashboard']);
          // } else if (PMHelperService.userRole === "PROJECTMANAGERS") {
          //   this.router.navigate(['/pm-dashboard']);
          // } else {
          //   this.router.navigate(['/hr-dashboard']);
          // }


          const e = PMHelperService.loginUserMetaData.message;
          if (data.meta.status === 0){
            swal.fire({
              title: 'Error!',
              icon: 'info',
              text: data.meta.message,
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            swal.fire({
              icon: 'success',
              text: data.meta.message,
              showConfirmButton: false,
              timer: 1500
            });
          }

          swal.fire({
            icon: 'success',
            text: data.meta.message,
            showConfirmButton: false,
            timer: 1500
          });
        }, (err: any) => {
          const e = err.meta.message;
          swal.fire(
            'Error!',
            e,
            'info'
          );
        })
      }, (err) => {
        // if (PMHelperService.loginUserMetaData.status === 0) {
        //   const e = PMHelperService.loginUserMetaData.message;
        //   swal.fire(
        //     'Error!',
        //     e,
        //     'info'
        //   );
        // }
        swal.fire(
          'Error!',
          'Server is not responding. Please try after sometime.',
          'error'
        );
      });
    }
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
