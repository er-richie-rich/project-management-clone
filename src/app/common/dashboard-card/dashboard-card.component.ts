import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit {
  @Input() backgroundImage: any  ;
  @Input() icon: any  ;
  @Input() count: any;
  @Input() message: string = '';
  @Input() color:string=''

  @Output() popup = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  popupOpen() {
    this.popup.emit()
  }

}
