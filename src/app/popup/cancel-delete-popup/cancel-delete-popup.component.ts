import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-cancel-delete-popup',
  templateUrl: './cancel-delete-popup.component.html',
  styleUrls: ['./cancel-delete-popup.component.scss']
})
export class CancelDeletePopupComponent implements OnInit {
    constructor(
      public dialogRef: MatDialogRef<CancelDeletePopupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }
  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }
}
