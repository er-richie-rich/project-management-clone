import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {DatePipe} from "@angular/common";
import {saveAs} from "file-saver";
import swal from "sweetalert2";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-popup-import-leads',
  templateUrl: './popup-import-leads.component.html',
  styleUrls: ['./popup-import-leads.component.scss']
})
export class PopupImportLeadsComponent implements OnInit {
  selectedFiles: any = FormGroup;
  files: any[] = [];
  onSave = new EventEmitter();
  filename: any;
  fileExcelName: any;
  excelFileName: any;
  url: any;
  myGroup: any = FormGroup;
  selectedItem: any;
  isFileValid:boolean = true;

  constructor(
    public dialogRef: MatDialogRef<PopupImportLeadsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: PMApiServicesService,
    private fb: FormBuilder,
  ) {
  }

  get f() {
    return this.myGroup.controls;
  }

  ngOnInit(): void {
    this.filename = this.files;
    this.myGroup = this.fb.group({
      selectedFiles: ['', Validators.required],
    });
  }

  onFileDropped($event: any[]) {
    this.isFileValid = true;
    let fileType = $event[0].type
    var validFormats = ['.csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (validFormats.includes(fileType)) {
      this.prepareFilesList($event);
    } else {
      swal.fire(
          '',
          'Please upload a valid file!',
          'info'
      ).then(()=>{
        this.myGroup.patchValue({
          selectedFiles : ""
        })
        this.isFileValid = false;
      });
    }
  }

  fileBrowseHandler(files: any) {
    this.isFileValid = true;
    let fileType = files[0].type
    var validFormats = ['.csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (validFormats.includes(fileType)) {
      this.prepareFilesList(files);
    } else {
      swal.fire(
          '',
          'Please upload a valid file!',
          'info'
      ).then(()=>{
        this.myGroup.patchValue({
          selectedFiles : ""
        })
        this.isFileValid = false;
      });
    }
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.myGroup.patchValue({
      selectedFiles : ""
    })
    if(this.files.length === 0){
      this.isFileValid = false;
    }
  }

  uploadFileSimulator(index: number) {
    /*setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index]?.progress === 100) {
            clearInterval(progressInterval);
            this.uploadFileSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);*/

      if (index === this.files.length) {
        return;
      } else {
          if (this.files[index]?.progress === 100) {
            this.uploadFileSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
      }
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFileSimulator(0);
  }

  _formatBytes(_bytes: any, decimals: any) {
    if (_bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(_bytes) / Math.log(k));
    return parseFloat((_bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  _downloadSampleFile() {
    this.apiService.downloadSampleLeadsFile({}).subscribe(
      data => {
        if (data && data?.meta) {
          if (data.meta.status == 1) {
            this.url = data.data.url;
            const date = new DatePipe('en-US').transform(new Date(), 'ddMMyy');
            const filename = 'lead_import_sample_' + date + '.xlsx';
            saveAs.saveAs(this.url, filename);
            let metaData: any = data.meta.message;
            swal.fire(
              'Success',
              metaData,
              'success'
            ).then();
          } else {
            swal.fire(
              'Error!',
              data.meta.message,
              'error'
            ).then();
          }
        } else {
          swal.fire(
            'Error!',
            "Server Error",
            'error'
          ).then();
        }
      }
    )
  }

  closeDialog = () => {
    this.dialogRef.close()
  }

  upload($event: any): void {
    // this.selectedItem = this.myGroup.controls.selectedFiles.status;
    // if (this.selectedItem === 'VALID')
    if(this.files.length > 0){
      this.fileExcelName = this.filename;
      for (let i = 0; i < this.fileExcelName.length; i++) {
        this.excelFileName = this.fileExcelName[i];
      }
      this.dialogRef.close(this.excelFileName);
    } else {
      this.isFileValid = false;
      return
    }
  }
}
