import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import swal from "sweetalert2";

@Component({
  selector: 'app-popup-add-report-inventory',
  templateUrl: './popup-add-report-inventory.component.html',
  styleUrls: ['./popup-add-report-inventory.component.scss']
})
export class PopupAddReportInventoryComponent implements OnInit {
  reportForm:FormGroup;
  inventoryId:any;
  inventories: any = [
    {value: 'Desktop'},
    {value: 'Laptop'},
    {value: 'Keyboard-Mouse'},
    {value: 'HeadPhone'},
    {value: 'Ram'},
    {value: 'Storage'},
  ];
  constructor(
      public apiService : PMApiServicesService,
      private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<PopupAddReportInventoryComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {inventoryId:string}
  ) {
    this.inventoryId=data.inventoryId;
    this.reportForm = this._formBuilder.group({
      inventoryId:[this.inventoryId],
      inventoryType:['',Validators.required],
      message:['',Validators.required],
    });
  }

  ngOnInit(): void {
  }
  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }
  space(event:any) {
    if ((event.target.selectionStart === 0) && (event.code === 'Space' ||  event.code === 'Numpad0')){
      event.preventDefault();
    }
  }
  addLeave(){
    if(this.reportForm.valid){
      this.apiService.addInventoryReport(this.reportForm.value).subscribe((data : any) => {
        this.dialogRef.close(false);
        swal.fire(
            'Success',
            "Report added successfully",
            'success'
        );
      });
    }
  }
}
