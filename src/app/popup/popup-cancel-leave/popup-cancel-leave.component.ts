import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-popup-cancel-leave',
  templateUrl: './popup-cancel-leave.component.html',
  styleUrls: ['./popup-cancel-leave.component.scss']
})
export class PopupCancelLeaveComponent implements OnInit {

  constructor(
      public dialogRef: MatDialogRef<PopupCancelLeaveComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }
  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

}
