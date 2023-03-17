import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import { PMHelperService } from 'src/services/PMHelper.service';
import { DatePipe } from "@angular/common";
import swal from 'sweetalert2';
import { dateValidation } from "./add-edit-employee-custom.validators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss']
})
export class AddEditEmployeeComponent implements OnInit  {
  fileName: any;
  fileData: any;
  userRoleData: any = [];
  myProfileForm: FormGroup;
  reportingManagerName: any = [];
  selectedReportingManager:string = '';
  validFormats: any = [];
  filePDF: any;
  url: any = "assets/images/profile-picture-default.png";
  profileImage: any;
  editMode: string = "Add";
  isAddShow: boolean = true;
  userId: any;
  loginId: any;
  idProofFiles: any;
  departmentList:any;
  imagePreview : any;
  docRefName:any;
  extension: any;
  documentName:any;
  activeStatus:boolean = true;
  public empProfileImage: any;
  empImageName: any;
  maxDate : any;
  minDate : any;
  minProbDate : any;
  minBirthDate: any;
  maritalStatusval:any;
  currentDate = new Date();
  userStatus: any = [
    { value: 1, valueName: 'ACTIVE' },
    { value: 2, valueName: 'INACTIVE' }
  ]
  MaritalStatus: any = [
    {value: true, valueName: 'Married'},
    {value: false, valueName: 'UnMarried'},
  ];
  GenderDetail: any = [
    {value: 'Male'},
    {value: 'Female'},
  ];
  panCardNumberUpperCase: string = '';

  constructor(
    private dateFormate:DatePipe,
    private _formBuilder: FormBuilder,
    private apiService: PMApiServicesService,
    private router: Router,
    public route: ActivatedRoute,
    private modle: NgbModal,
    public helper:PMHelperService,
    @Inject(DOCUMENT) private doc: Document,
  ) {
    const id: any = this.route.snapshot.paramMap.get('id');
    // this.selectedReportinManager = id
    this.loginId = PMHelperService.loginUserID;
    this.myProfileForm = this._formBuilder.group({
      userId: [],
      profileImage: [''],
      empCode:['', Validators.required],
      fullName: ['',Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(50),  Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')])],
      mobileNumber: [''],
      dateOfBirth: ['', Validators.required],
      dateOfJoining: ['', Validators.required],
      designation: ['', Validators.required],
      panCardNumber: ['', Validators.required],
      status: [1, Validators.required],
      reportingManager: ['', Validators.required],
      department: ['', Validators.required],
      probationPeriodEndDate: ['', Validators.required],
      additionalNotes: [''],
      userRole: ['', Validators.required,],
      password: [''],
      maritalStatus: ['',Validators.required],
      fatherName: ['',Validators.required],
      spouseName: ['',Validators.required],
      fatherOrSpouseContactNumber: ['',Validators.required],
      personalEmail: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(50), Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),])],
      currentAddress: ['',Validators.required],
      permanentAddress: ['',Validators.required],
      gender: ['',Validators.required],
      aadhaarNumber: ['',Validators.required],
      idProofFiles:[]
    });
    if (id !== "0") {
      this.activeStatus = false;
      this.editMode = "Edit";
      this.apiService.getUser(id).subscribe((data: any) => {
        let userData = data.data;
        this.imagePreview = userData.idProofFiles;
        this.documentName = userData.idProofFiles;
        let doj;
        let dob;
        let proDate;
        if(userData.dateOfBirth != 0){
          dob = this.dateFormate.transform(userData.dateOfBirth, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
        }
        if(userData.dateOfJoining != 0){
          doj = this.dateFormate.transform(userData.dateOfJoining, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
        }
        if(userData.probationPeriodEndDate != 0){
          proDate = this.dateFormate.transform(userData.probationPeriodEndDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
        }
        this.myProfileForm.patchValue({
          userId: userData.userId,
          empCode: userData.empCode,
          fullName: userData.fullName,
          email: userData.email,
          mobileNumber: userData.mobileNumber,
          dateOfBirth: dob,
          dateOfJoining: doj,
          designation: userData.designation,
          panCardNumber: userData.panCardNumber,
          reportingManager: userData.reportingManagerId,
          department: userData.departmentId,
          probationPeriodEndDate:proDate,
          status: userData.status,
          userRole: userData.roleId,
          additionalNotes: userData.additionalNotes,
          maritalStatus:userData.maritalStatus,
          fatherName:userData.fatherName,
          spouseName:userData.spouseName,
          fatherOrSpouseContactNumber:userData.fatherOrSpouseContactNumber,
          personalEmail:userData.personalEmail,
          currentAddress:userData.currentAddress,
          permanentAddress:userData.permanentAddress,
          gender:userData.gender,
          aadhaarNumber:userData.aadhaarNumber
        });
        if(doj){
          this.minDate = doj
        }
        this.url = userData.profileImage ? userData.profileImage : this.url
        this.fileName = userData.idProofFiles
      }, err => {
        swal.fire('Error!', err.error.message, 'info');
      });
    }
      this.myProfileForm.setValidators(dateValidation(this.dateFormate))
  }

  ngOnInit(): void {
    this.doc.body.classList.add('custom-modal-width');
    let minDay = this.currentDate.getDate();
    let minMonth = this.currentDate.getMonth();
    let minYear = this.currentDate.getFullYear() - 18;
    this.minBirthDate = new Date(minYear, minMonth, minDay);

    let maxDay = this.currentDate.getDate();
    let maxMonth = this.currentDate.getMonth() ;
    let maxYear = this.currentDate.getFullYear();
    this.maxDate = new Date(maxYear, maxMonth, maxDay);

    let minJoinDay = this.currentDate.getDate();
    let minJoinMonth = this.currentDate.getMonth() ;
    let minJoinYear = this.currentDate.getFullYear();
    this.minDate = new Date(minJoinYear, minJoinMonth, minJoinDay);

    this.userId= this.route.snapshot.paramMap.get('id');
    this.apiService.lisEmp({limit:1000}).subscribe((data: any) => {
      this.reportingManagerName = data.data;
    }, err => {
    });
    this.apiService.listRole({ page: 1, limt: 10 }).subscribe((data: any) => {
      this.userRoleData = data.data;
    }
    )
    this.getDepartmentList();
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
  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

  getProbDate(event:any)  {
    let minDay = event.target.value.getDate();
    let minMonth = event.target.value.getMonth() + 3;
    let minYear = event.target.value.getFullYear();
    this.minProbDate = new Date(minYear, minMonth, minDay);
    //
  }
  getDate(event:any)  {
    let minDay = event.target.value.getDate();
    let minMonth = event.target.value.getMonth();
    let minYear = event.target.value.getFullYear() + 18;
    this.minDate = new Date(minYear, minMonth, minDay);

    let maxDay = this.currentDate.getDate();
    let maxMonth = this.currentDate.getMonth() ;
    let maxYear = this.currentDate.getFullYear();
    this.maxDate = new Date(maxYear, maxMonth, maxDay);
    }

  onFileChanged(event: any) {
    this.docRefName =event.target.files[0].name;
    const exc = this.docRefName.split('.').pop();
    if(exc === 'pdf'){
      this.documentName = event.target.files[0].name;
      this.idProofFiles = event.target.files[0]
      this.fileName = event.target.files[0].name;
      const blob = new Blob([this.idProofFiles], { type: this.idProofFiles.type });
      this.imagePreview = window.URL.createObjectURL(blob);
    } else {
      let message = "The document should be in PDF format only"
      swal.fire('Error!',message , 'info');
    }
  }

  openTemplate(content: any) {
    if (content) {
      this.modle.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any) => {
        if (result) {
        }
        // this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  onFileChanged2(event: any) {
    this.profileImage = event.target.files[0]
    let imageType = (this.profileImage && this.profileImage.type) ? this.profileImage.type : null;
    var validFormats = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif'];
    if (validFormats.includes(imageType)) {
      const reader = new FileReader();
      reader.readAsDataURL(this.profileImage);
      this.empImageName = 'File selected';
      reader.onload = () => {
        this.url = reader.result;
      };
    } else {
      swal.fire(
        '',
        'Invalid image extension !!',
        'info'
      ).then(()=>{
        this.profileImage = '';
        this.empProfileImage = null
      });
    }
  }
  getMaritalStatus(status:any){
   this.maritalStatusval = status
  }

  onAddUser(): any {
    if(this.myProfileForm.controls.maritalStatus.value === false){
      this.myProfileForm.get('spouseName')?.setErrors(null);
    }
    if (this.myProfileForm.valid) {
      this.fileData = new FormData();
      let getInputsValues = this.myProfileForm.value;
      for (let key in getInputsValues) {
        this.fileData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
        }
      this.fileData.append('idProofFiles', this.idProofFiles);
      this.fileData.append('profileImage', this.profileImage);
      this.apiService.addEditUser(this.fileData).subscribe((data: any) => {
        // this.router.navigate(['/employee-management']);
        if (data.meta.status === 0){
          swal.fire('Error!', data.meta.message, 'info');
        } else {
          this.setIsClicked()
          this.router.navigate(['/employee-management']);
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
  // file reset
  resetCoverValue() {
    this.myProfileForm.patchValue({
      idProofFiles:""
    })
    this.filePDF = null;
    this.fileName = null;
  }

  checkNumber(e:ClipboardEvent){
    let data = e.clipboardData
    let pasteData = data?.getData('text')
    if (!Number(pasteData)){
      e.preventDefault();
    }
  }

  backToEmployeeList(){
    this.setIsClicked()
    this.router.navigate(['/employee-management']).then();
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }

}
