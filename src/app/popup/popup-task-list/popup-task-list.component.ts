import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-popup-task-list',
  templateUrl: './popup-task-list.component.html',
  styleUrls: ['./popup-task-list.component.scss']
})
export class PopupTaskListComponent implements OnInit {

  taskName = "";
  addTaskListForm: FormGroup;
  projectId:string | null = "0";
  mode: string = "Add";
  taskListId : string | null = "0";

  constructor(
    public dialogRef: MatDialogRef<PopupTaskListComponent>,
    private _formBuilder: FormBuilder,
    public route: ActivatedRoute,
    public apiService : PMApiServicesService,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {projectId: string, index : number, taskListId : string},
    //@Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projectId = data.projectId;
    this.taskListId = data.taskListId
    this.addTaskListForm = this._formBuilder.group({
      projectId:[this.projectId],
      title:['',Validators.required],
      taskListId:[this.taskListId],
    });

    if( this.data.index === 0){
      this.mode = "Edit";
      this.apiService.viewListTaskApi({taskListId : data.taskListId}).subscribe((data:any) =>{
        let getListTaskData = data.data;
        this.addTaskListForm.patchValue({
          title : getListTaskData.title,
          taskListId : this.taskListId
        });
      });
    }

  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close({result: false});
  }

  addEditTaskList(){
    if (this.addTaskListForm.valid) {
      this.apiService.addEditTaskListApi(this.addTaskListForm.value).subscribe((data: any) => {
        //this.router.navigate(['/project-management/project-details/task-manage/'+ this.projectId]);
        this.dialogRef.close({result: true, data: data.data});
        swal.fire('', data.meta.message, 'success');
      }, (err) => {
        swal.fire('Error!', err.error.message, 'info');
      });
    }
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
