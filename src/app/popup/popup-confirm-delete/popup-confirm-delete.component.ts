import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-popup-confirm-delete',
  templateUrl: './popup-confirm-delete.component.html',
  styleUrls: ['./popup-confirm-delete.component.scss']
})
export class PopupConfirmDeleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PopupConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
  {

  }

  onNoClick(com: any): void {
    this.dialogRef.close(com);
  }

  ngOnInit(): void {
  }

}
