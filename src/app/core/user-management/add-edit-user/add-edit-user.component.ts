import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import swal from 'sweetalert2';
import {noWhitespaceValidation, PMHelperService} from "../../../../services/PMHelper.service";
import {number} from "ng2-validation/dist/number";

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {
  addUserForm: any = FormGroup;
  userRoleData: any = [];
  reportingManagerName: any = [];
  selectedReportingManager:any;
  departmentList:any;
  editMode: string = "Add";
  isAddShow: boolean = true;
  manager:any;
  managerName:any ='';
  depId:any;
  depName:any;

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: PMApiServicesService,
    private router: Router,
    public helper : PMHelperService,
    public route: ActivatedRoute,
    private cdref: ChangeDetectorRef
  ) {
    const id: any = this.route.snapshot.paramMap.get('id');
    if (id != "0") {
      this.addUserForm = this._formBuilder.group({
        userId: [''],
        empCode: ['', [Validators.required, noWhitespaceValidation.noWhitespaceValidator]],
        fullName: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
        email: [null, Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),])],
        mobileNumber: ['', [Validators.compose([Validators.required, Validators.maxLength(10)]),noWhitespaceValidation.noWhitespaceValidator]],
        userRole: ['', [Validators.required, noWhitespaceValidation.noWhitespaceValidator]],
        reportingManager: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
        department: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
      });
      this.editMode = "Edit";
      this.apiService.getUser(id).subscribe((data: any) => {
        if (data && data?.meta && data.meta.status == 1) {
          let userData = data.data;
          this.depId = userData.departmentId
          this.depName = userData.departmentName
          this.getReportingManager(userData.roleId)
          this.selectedReportingManager = userData.reportingManagerId
          this.managerName =userData.reportingManagerName;
          this.addUserForm.patchValue({
            userId: userData.userId,
            empCode: userData.empCode,
            fullName: userData.fullName,
            email: userData.email,
            mobileNumber: userData.mobileNumber,
            department:userData.departmentId,
            userRole: userData.roleId,
            reportingManager: userData.reportingManagerId,
            roleName: userData.roleName,
          });
        }
      }, err => {
        swal.fire('Error!', err.error.message, 'info').then();
      });
    } else {
      this.addUserForm = this._formBuilder.group({
        userId: [''],
        empCode: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
        fullName: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
        email: [null, Validators.compose([Validators.required, Validators.email, Validators.maxLength(50), Validators.pattern('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$'),])],
        mobileNumber: ['', [Validators.compose([Validators.required, Validators.maxLength(10)]), noWhitespaceValidation.noWhitespaceValidator]],
        userRole: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
        password: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
        reportingManager: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
        department: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
        
      });
    }
    if (id !== '0') {
      this.isAddShow = !this.isAddShow;
    }
  }

  ngOnInit(): void {
    this.apiService.listRole({page: 1, limt: 10}).subscribe((data: any) => {
        this.userRoleData = data.data;
      }
    )
    this.getDepartmentList();
  }
  getReportingManager(userRole: any){

    this.addUserForm.patchValue({
      reportingManager: '',
    })
    this.apiService.getUserReporingManager({userRole:userRole}).subscribe((data: any) => {
      this.reportingManagerName = data.data;
        })
  }
  getDepartmentList(){
    let data = {
      limit : 1000
    };
    this.apiService.departmentList(data).subscribe((res:any)=>{
      if(res.meta.status === 1){
        this.departmentList = res.data
      }
    })
  }
  //Create & Edit User
  addUser() {
    if (this.addUserForm.valid) {
      this.helper.toggleLoaderVisibility(true)
      this.apiService.addEditUser(this.addUserForm.value).subscribe((data: any) => {
        if (data.meta.status === 1){
          this.setIsClicked()
          this.router.navigate(['/user-management']).then();
          swal.fire('', data.meta.message, 'success');
        } else {
          swal.fire('Info!', data.meta.message, 'info');
        }
        this.helper.toggleLoaderVisibility(false)
      }, (err) => {
        this.helper.toggleLoaderVisibility(false)
        swal.fire('Error!', err.error.message, 'error');
      });
    }
  }

  backToUserList = () => {
    this.setIsClicked()
    this.router.navigate(['/user-management']).then();
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space' ){
      event.preventDefault();
    }
  }

  spaceInPwd(event:any){
    if (event.target.selectionStart === 0 && event.code === 'Space' || event.code === 'Space' ){
      event.preventDefault();
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  clearSearchManager(){
    this.manager = '';
  }

  checkNumber(e:ClipboardEvent){
    let data = e.clipboardData
    let pestData = data?.getData('text')
    if (!Number(pestData)){
      e.preventDefault();
    }
  }

  checkSpace(e:ClipboardEvent){
    let data = e.clipboardData
    let pestData = data?.getData('text')
    if(pestData?.includes(' ')){
      e.preventDefault();
    }
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }
}
