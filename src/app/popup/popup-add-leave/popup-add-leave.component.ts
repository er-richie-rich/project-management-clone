import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import swal from "sweetalert2";

@Component({
  selector: 'app-popup-add-leave',
  templateUrl: './popup-add-leave.component.html',
  styleUrls: ['./popup-add-leave.component.scss']
})
export class PopupAddLeaveComponent implements OnInit {
  addLeaveForm:FormGroup;
  userId: string | null = "0";
  leaveBalance :any = [];
  casualLeaveBalance:any;
  LWPLeaveBalance:any;
  constructor(
      public apiService : PMApiServicesService,
      private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<PopupAddLeaveComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {userId:string}
  )
  {
    this.userId=data.userId;
    this.addLeaveForm = this._formBuilder.group({
      userId:[this.userId],
      leaveBalanceId:[''],
      casualLeaveBalance:['', [Validators.required, Validators.maxLength(3)]],
      LWPLeaveBalance:['', [Validators.required, Validators.maxLength(3)]]
    });
  }
  
  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }
  
  ngOnInit(): void {
    this.getLeaveBalance({})
  }
  getLeaveBalance(req: any): any {
    req.userId = this.userId;
    this.apiService.viewLeaveBalance(req).subscribe((data: any) => {
      this.leaveBalance = data.data;
      this.casualLeaveBalance =this.leaveBalance.casualLeaveBalance > 0 ? this.leaveBalance.casualLeaveBalance : '';
      this.LWPLeaveBalance =this.leaveBalance.LWPLeaveBalance > 0 ? this.leaveBalance.LWPLeaveBalance : '';
      this.addLeaveForm.patchValue({
        casualLeaveBalance : this.casualLeaveBalance.toString(),
        LWPLeaveBalance : this.LWPLeaveBalance.toString(),
        leaveBalanceId:this.leaveBalance.leaveBalanceId
      })
    });
  }
  addLeave(){
    if(this.addLeaveForm.valid){
      this.apiService.addLeaveBalance(this.addLeaveForm.value).subscribe((data : any) => {
        this.dialogRef.close(false);
        swal.fire(
            'Success',
            "Leave balance added successfully",
            'success'
        );
      });
    }
  }
  
  space(event:any) {
    if ((event.target.selectionStart === 0) && (event.code === 'Space' ||  event.code === 'Numpad0')){
      event.preventDefault();
    }
  }
  _keyPress(event:any){
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
