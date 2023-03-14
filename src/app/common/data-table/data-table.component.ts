import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  // table data
  sortBy=1;
  sortKey='startDate';
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
  @Input() changePasswordOn: boolean = false;

  @Output() view = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();
  @Output() changePassword = new EventEmitter<any>();


  @Input() id: any;

  constructor() {
  }

  ngOnInit(): void {
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

  masterToggleEvent(element:any) {
    this.masterToggle.emit(element)
  }

  isAllSelectedEvent():any{
    this.isAllSelected.emit()
  }




}
