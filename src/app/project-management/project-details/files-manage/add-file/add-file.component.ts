import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import swal from 'sweetalert2';
import {Location} from "@angular/common";

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnInit {
  addFileForm: any = FormGroup;
  public files: any;
  filePDF: any;
  editMode: string = "Add";
  projectId: string | null = "0";
  projectFileId: string | null = "0";
  projectFile: any ;
  fileName: any;
  submitted: any = false;
  fileData: any;

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: PMApiServicesService,
    public router: Router,
    public route: ActivatedRoute,
    private location:Location,
  ) {
    this.files = []

    // get id from route
    this.projectId = this.route.snapshot.paramMap.get('id');

    this.projectFileId = this.route.snapshot.paramMap.get('projectFileId')

    // form data
    this.addFileForm = this._formBuilder.group({
      projectId: [this.projectId],
      projectFile:['',Validators.required],
      // projectFile:['',Validators.required],
      projectFileId: ['', null]
    });

    // for edit
    if (this.projectFileId != "0") {
      this.editMode = "Edit"
      this.apiService.getFile({ projectFileId: this.projectFileId }).subscribe((data: any) => {
        const FileData = data.data;
        this.fileName=FileData.fileName;
        this.projectFile=FileData.fileLink;
        this.addFileForm.patchValue({
          projectId: FileData.projectId,
          projectFile:FileData.fileLink,
          projectFileId: FileData._id,
        });
      });
    }
  }



  ngOnInit() { }

  onFileChanged(event: any) {
    this.projectFile = event.target.files[0]
    this.fileName = event.target.files[0].name;
}
  // Add & Update  file
  onUploadFile(): any {
    this.submitted = true;
    if (this.addFileForm.valid && this.projectFile && this.fileName) {
      this.fileData = new FormData();
      let getInputsValues = this.addFileForm.value;
      for (let key in getInputsValues) {
        this.fileData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
      }
        this.fileData.append('projectFile', this.projectFile)

        this.apiService.addEditFile(this.fileData).subscribe((data: any) => {
          this.setIsClicked()
          this.router.navigate(['project-management/project-details/project-data/' + this.projectId]);
          swal.fire('', data.meta.message, 'success');
      }, (err) => {
        swal.fire('Error!', err.error.message, 'info');
      })
}}
  resetCoverValue() {
    this.projectFile = null;
    this.fileName = null;
    this.addFileForm.patchValue({
      projectFile:"",
    });
  }

  back(){
    this.setIsClicked()
    this.location.back();
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }


}

