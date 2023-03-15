import {Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  // table data
  @Input() columns :any;
  @Input() headers :any;
  @Input() data:any;
  @Input() dateFields:any;


  //checkbox selection
  @Input() selection :any;
  @Input() isAllSelectedCheck :any;
  @Output() masterToggle = new EventEmitter<any>();
  @Output() isAllSelected = new EventEmitter<any>();


  //table actions
  @Input() element: any;
  @Input() icons: string | undefined;
  @Input() viewOn: boolean = false;
  @Input() cancelOn: boolean = false;
  @Input() editOn: boolean = false;
  @Input() deleteOn: boolean = false;
  @Input() logOn: boolean = false;
  @Input() changeOn: boolean = false;
  @Input() downloadOn: boolean = false;
  @Input() openOn: boolean = false;
  @Input() changePasswordOn: boolean = false;
  // @Input() rejectOn: boolean = false;
  // @Input() approveOn: boolean = false;

  @Output() view = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();
  @Output() changePassword = new EventEmitter<any>();
  @Output() download = new EventEmitter<any>();
  @Output() open = new EventEmitter<any>();
  @Output() reject = new EventEmitter<any>();
  @Output() approve = new EventEmitter<any>();


  @Input() id: any;

  constructor() {
  }

  ngOnInit(): void {
    // console.log(this.columns)
    // console.log(this.headers.includes('date'))
  }

  viewDetail(element:any) {
    this.view.emit(element)
  }

  editEvent(element:any) {
    this.edit.emit(element)
  }

  deleteEvent(element:any) {
    this.delete.emit(element)
  }
  cancelEvent(element:any) {
    this.delete.emit(element)
  }
  changeEvent(event:any ,element:any) {
    this.change.emit({event,element})
  }
  changePasswordEvent(element:any) {
    this.changePassword.emit(element)
  }
  downloadEvent(element:any) {
    this.download.emit(element)
  }
  openEvent(content:any,element:any) {
    this.open.emit({content,element})
  }
  masterToggleEvent(element:any) {
    this.masterToggle.emit(element)
    }
  isAllSelectedEvent(){
  this.isAllSelected.emit()
  }

  rejectEvent(element:any){
    this.reject.emit(element)
  }

  approveEvent(element:any){
    this.approve.emit(element)
  }

}
