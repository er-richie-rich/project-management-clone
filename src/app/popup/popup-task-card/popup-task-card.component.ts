import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-popup-task-card',
  templateUrl: './popup-task-card.component.html',
  styleUrls: ['./popup-task-card.component.scss']
})
export class PopupTaskCardComponent implements OnInit {

  taskListId : any = true;
  addTaskCardForm : FormGroup;
  mode: string = "Add";
  listCardId : string | null = "0";
  //cardId : string | null = "0";

  constructor(
    public dialogRef : MatDialogRef<PopupTaskCardComponent>,
    private _formBuilder: FormBuilder,
    public apiService : PMApiServicesService,
    @Inject(MAT_DIALOG_DATA) public data: {taskListId: string, index : number, listCardId : string},
  ) {
    this.taskListId = data.taskListId;
    this.listCardId = data.listCardId;
    this.addTaskCardForm = this._formBuilder.group({
      taskListId:[this.taskListId],
      title:['',Validators.required],
      listCardId:[this.listCardId],
      cardId : [this.taskListId]
    });

    if( this.data.index === 0){
      this.mode = "Edit";
      this.apiService.viewCardTaskApi({listCardId : data.listCardId}).subscribe((data : any) => {
        let getCardTaskData = data.data;
        this.addTaskCardForm.patchValue({
          title : getCardTaskData.title,
        });
      });
    }
  }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close({result: false});
  }

  addEditTaskCard(){
    if(this.addTaskCardForm.valid){
      this.apiService.addEditTaskCardApi(this.addTaskCardForm.value).subscribe((data : any) => {
        this.dialogRef.close({result: true, data: data.data});
        Swal.fire('', data.meta.message, 'success');
      }, (err) => {
        Swal.fire('Error!', err.error.message, 'info');
      });
    }
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
