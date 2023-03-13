import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PMApiServicesService} from "../../../../services/PMApiServices.service";
import {ActivatedRoute, Router} from "@angular/router";
import swal from "sweetalert2";
import {noWhitespaceValidation, PMHelperService} from "../../../../services/PMHelper.service";


@Component({
  selector: 'app-add-edit-department',
  templateUrl: './add-edit-department.component.html',
  styleUrls: ['./add-edit-department.component.scss']
})
export class AddEditDepartmentComponent implements OnInit {
  departmentForm: any = FormGroup;
  editMode: string = "Add";
  constructor(private _formBuilder: FormBuilder,
              private apiService: PMApiServicesService,
              public route: ActivatedRoute,
              private router: Router,
              public helper:PMHelperService) {
    this.departmentForm = this._formBuilder.group({
      departmentId:[],
      departmentTitle: ['', [Validators.required, noWhitespaceValidation.noWhitespaceValidator]],
      accessModule: [false]
    });

    const id: any = this.route.snapshot.paramMap.get('id');
    if (id != "0") {
      this.editMode = "Edit";
      this.apiService.getDepartment(id).subscribe((data: any) => {
        if (data && data?.meta && data.meta.status == 1) {
          let departmentData = data.data;
          this.departmentForm.patchValue({
            departmentId:departmentData.departmentId,
            departmentTitle: departmentData.departmentTitle,
            accessModule: departmentData.accessModule,
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

  AddDepartment(){
    if(this.departmentForm.valid){
      this.apiService.addDepartment(this.departmentForm.value).subscribe((data:any)=>{
          if (data.meta.status === 0){
            swal.fire('Error!', data.meta.message, 'info');
          } else {
            this.setIsClicked()
            this.router.navigate(['/department-management']);
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

  goToDepartmentList(){
    this.setIsClicked()
    this.router.navigate(['/department-management/']).then();
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }
}


