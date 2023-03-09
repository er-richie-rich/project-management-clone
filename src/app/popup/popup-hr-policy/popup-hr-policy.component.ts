import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-hr-policy',
  templateUrl: './popup-hr-policy.component.html',
  styleUrls: ['./popup-hr-policy.component.scss']
})
export class PopupHrPolicyComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PopupHrPolicyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
  {

  }

  ngOnInit(): void {
  }

  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

}
