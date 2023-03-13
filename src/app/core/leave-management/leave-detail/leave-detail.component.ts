import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PMApiServicesService} from "../../../../services/PMApiServices.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.scss']
})
export class LeaveDetailComponent implements OnInit {
  leaveId:any;
  leaveDetail:any;
  constructor(public route: ActivatedRoute,public apiService: PMApiServicesService,private location:Location) {
    this.leaveId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {

    this.getLeaveDetail()
  }

  getLeaveDetail(){
    let data = {
      leaveId:this.leaveId
    }
    this.apiService.getLeaveDetail(data).subscribe((res:any)=>{
      if(res.meta.status === 1){
        this.leaveDetail = res.data
      }
    })
  }

  backToLeaveList(){
    this.setIsClicked()
    this.location.back()
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }

}
