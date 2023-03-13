import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PMApiServicesService } from 'src/services/PMApiServices.service';
import swal from 'sweetalert2';
import {DatePipe, Location} from "@angular/common";
interface proTypes {
  value: string;
  valueName: string;
}
@Component({
  selector: 'app-add-milestone',
  templateUrl: './add-milestone.component.html',
  styleUrls: ['./add-milestone.component.scss']
})
export class AddMilestoneComponent implements OnInit {
  addMilestoneForm: FormGroup;
  editMode: string = "Add";
  projectId:string | null ="0";
  editmilestoneId:string | null ="0";
  currentDate = new Date();
  todayDate : any;

  projectStatus: any = [
    {name: 'In Progress', value: 'in progress'},
    {name: 'Completed', value: 'completed'},
    {name: 'On Hold', value: 'on hold'}

  ];

  constructor(
    public dateFormate:DatePipe,
    private _formBuilder: FormBuilder,
    public route: ActivatedRoute,
    public apiService: PMApiServicesService,
    public router: Router,
    private location:Location
  ) {

    this.projectId= this.route.snapshot.paramMap.get('id')||null;
    this.editmilestoneId=this.route.snapshot.paramMap.get('editmilestoneId')|| null;

    this.addMilestoneForm = this._formBuilder.group({
      projectId:[this.projectId],
      milestoneTitle:['',Validators.required],
      expectedDate:['',Validators.required],
      milestoneStatus: ['',Validators.required],
      milestoneId:[],
    });
    if(this.editmilestoneId != "0"){
      this.editMode="Edit";
      this.apiService.getMilestone({milestoneId:this.editmilestoneId}).subscribe((data: any) => {
      let milestoneData = data.data;
        let expectedDate = this.dateFormate.transform(milestoneData.expectedDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
        this.addMilestoneForm.patchValue({
        projectId: this.projectId,
        milestoneTitle:milestoneData.milestoneTitle,
        expectedDate:expectedDate,
        milestoneStatus:milestoneData.milestoneStatus,
        milestoneId:milestoneData.milestoneId
        })
      });
    }

  }

  ngOnInit(): void {
    let minJoinDay = this.currentDate.getDate();
    let minJoinMonth = this.currentDate.getMonth() ;
    let minJoinYear = this.currentDate.getFullYear();
    this.todayDate = new Date(minJoinYear, minJoinMonth, minJoinDay);
  }


  // viewProject(id: any): any {
  //   this.router.navigate([ 'project-management/project-details/project-data/' + id, ]);
  // }

  back(){
    this.setIsClicked()
    this.location.back();
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }

  // Add-edit milestone project
  addEditMilestone():any {
    if (this.addMilestoneForm.valid) {
      this.apiService.addEditMileStone(this.addMilestoneForm.value).subscribe((data: any) => {
        // this.router.navigate(['/project-management/project-details/project-data/'+ this.projectId]);
        if (data.meta.status === 0){
          swal.fire('Error!', data.meta.message, 'info');
        } else {
          this.setIsClicked()
          this.router.navigate(['/project-management/project-details/project-data/'+ this.projectId]);
          swal.fire('', data.meta.message, 'success');
        }
      },(err) => {
        swal.fire('Error!', err.error.message, 'error');
      });
    }
    }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}

