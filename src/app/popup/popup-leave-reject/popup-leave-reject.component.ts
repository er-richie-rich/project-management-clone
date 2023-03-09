import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import {noWhitespaceValidation, PMHelperService} from "../../../services/PMHelper.service";

@Component({
  selector: 'app-popup-leave-reject',
  templateUrl: './popup-leave-reject.component.html',
  styleUrls: ['./popup-leave-reject.component.scss']
})
export class PopupLeaveRejectComponent implements OnInit {
  rejectLeaveForm:FormGroup;
  leaveId: string | null = "0";
  constructor(
      public helper: PMHelperService,
    public apiService : PMApiServicesService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PopupLeaveRejectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {leaveId:string}
  )
  {
    this.leaveId=data.leaveId;
    this.rejectLeaveForm = this._formBuilder.group({
      rejectReason:['',[Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
      leaveId:[this.leaveId],
      leaveStatus:["Rejected"]
    });


  }

  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

  ngOnInit(): void {
  }
  rejectLeave(){
    if(this.rejectLeaveForm.valid){
      this.apiService.approveAndRejectLeave(this.rejectLeaveForm.value).subscribe((data : any) => {
        this.dialogRef.close({result: true, data: data});
      });
    }
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
