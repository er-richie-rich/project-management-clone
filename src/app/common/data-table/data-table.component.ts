import {Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() columns :any;
  @Input() headers :any;
  @Input() data:any;

  @Input() element: any;
  @Input() icons: string | undefined;
  @Input() viewOn: boolean = false;
  @Input() cancelOn: boolean = false;
  @Input() editOn: boolean = false;
  @Input() deleteOn: boolean = false;
  @Input() logOn: boolean = false;
  @Input() changeOn: boolean = false;

  @Output() view = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();


  @Input() id: any;

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.columns)
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

}
