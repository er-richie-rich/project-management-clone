import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/services/auth-service.service';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import { PMHelperService, noWhitespaceValidation } from 'src/services/PMHelper.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  disabled: any = true;
  myProfileForm: FormGroup;
  profileImage: any
  selectedFile: any;
  imageType: any;
  validFormats: any = [];
  empImageName: any;
  url: any = "assets/images/profile-picture-default.png";
  public empProfileImage: any;
  userData: any;
  obj: any;
  constructor (
    private _formBuilder: FormBuilder,
    private authService: AuthServiceService,
    private apiService: PMApiServicesService,
    private router: Router,
    public route: ActivatedRoute,
    public helper: PMHelperService
  ) {
    this.myProfileForm = this._formBuilder.group({
      fullName: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
      email: [null, Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),])],
      mobileNumber: ['', Validators.compose([Validators.required, Validators.maxLength(10)])]
    });
    this.myProfileForm.controls['email'].disable();
  }
  ngOnInit(): void {
    if (PMHelperService.loginUserID) {
      this.apiService.getUserdetail(PMHelperService.loginUserID).subscribe((data: any) => {
        if (data && data?.meta) {
          if (data.meta.status == 1) {
            let userData = data.data;
            this.myProfileForm.patchValue({
              fullName: userData.fullName,
              email: userData.email,
              mobileNumber: userData.mobileNumber,
              profileImage: userData.profileImage
            });
            this.url = userData.profileImage ? userData.profileImage : this.url;
          } else {
            swal.fire('Error!', data.meta.message, 'info').then();
          }
        } else {
          swal.fire('Error!', "Sever Error", 'info').then();
        }
      });
    }
  }
  onFileChanged(event: any): void {
    this.selectedFile = event.target.files[0];
    let imageType = (this.selectedFile && this.selectedFile.type) ? this.selectedFile.type : null;
    var validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
    if (validFormats.includes(imageType)) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      this.empImageName = 'File selected';
      reader.onload = () => {
        this.url = reader.result;
      };
    } else {
      this.selectedFile = '';
      swal.fire(
        '',
        'Invalid image extension!',
        'info'
      ).then(()=>{
        this.empProfileImage = null
      });
    }
  }
  myProfile(): void {
    if (this.myProfileForm.valid) {
      let that = this;
      var editProfileData = new FormData();
      let getInputsValues = this.myProfileForm.value;
      for (let key in getInputsValues) {
        editProfileData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
      if (this.selectedFile) {
        editProfileData.append('profileImage', this.selectedFile);
      }
      this.apiService.editProfile(editProfileData).subscribe((data: any) => {
        if (data && data?.meta) {
          if (data.meta.status == 1) {
            let loginUser: any = data.data;
            this.userData = localStorage.getItem("loggedInUser");
            this.obj = JSON.parse(this.userData);
            this.obj.fullName = loginUser.fullName;
            this.obj.email = loginUser.email;
            this.obj.profileImage = loginUser.profileImage;
            localStorage.setItem('loggedInUser', JSON.stringify(this.obj));
            swal.fire(
              '',
              data.meta.message,
              'success'
            ).then();
          } else {
            swal.fire('Error!', data.meta.message, 'error').then();
          }
        } else {
          swal.fire('Error!', "Sever Error", 'error').then();
        }
      });
    }
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

  checkNumber(e:ClipboardEvent){
    let data = e.clipboardData
    let pasteData = data?.getData('text')
    if (pasteData?.includes('.') || !Number(pasteData)){
      e.preventDefault();
    }
  }
}
