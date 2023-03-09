import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-popup-update-status',
  templateUrl: './popup-update-status.component.html',
  styleUrls: ['./popup-update-status.component.scss']
})
export class PopupUpdateStatusComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PopupUpdateStatusComponent>,
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
