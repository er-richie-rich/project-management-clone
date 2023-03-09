import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthServiceService} from 'src/services/auth-service.service';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import swal from 'sweetalert2';
import {DatePipe} from "@angular/common";
import {PMHelperService} from "../../../services/PMHelper.service";

interface proTypes {
	value: string;
	valueName: string;
}

@Component({
	selector: 'app-add-edit-project',
	templateUrl: './add-edit-project.component.html',
	styleUrls: ['./add-edit-project.component.scss']
})

export class AddEditProjectComponent implements OnInit {
	addProjectForm: FormGroup;
	projectManagerName: any = [];
	editMode: string = "Add";
	getRole: any;
	projectStatus: any = [
		{name: 'In Progress', value: 'in progress'},
		{name: 'Completed', value: 'completed'},
		{name: 'On Hold', value: 'on hold'}
	];
	
	constructor(
		public dateFormate: DatePipe,
		public _formBuilder: FormBuilder,
		public authService: AuthServiceService,
		public apiService: PMApiServicesService,
		public router: Router,
		public route: ActivatedRoute,
		public helper : PMHelperService
	) {
		
		const id: any = this.route.snapshot.paramMap.get('id');
		this.addProjectForm = this._formBuilder.group({
			/*projectId:[],
			projectCode :['', Validators.required],
			projectName: ['', Validators.required],
			clientName: ['', Validators.required],
			projectManagerId:['',Validators.required],
			startDate: ['', Validators.required],
			technology: ['', Validators.required],
			projectStatus: ['', Validators.required],
			projectDescription:['',Validators.required],*/
			
			
			
			projectId: [],
			projectCode: ['', Validators.required],
			projectName: ['', Validators.required],
			clientName: ['', Validators.required],
			startDate: ['', Validators.required],
			estimatedHours: [''],
			completedHours: [''],
			email: ['', [Validators.required,Validators.pattern ,Validators.maxLength(50), Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),]],
			technology: ['', Validators.required],
			projectStatus: ['', Validators.required],
			projectManagerId: ['', Validators.required],
			projectDescription: ['', Validators.required],
		});
		
		//patchdata form backend
		
		
		if (id != 0) {
			this.editMode = "Edit";
			this.apiService.getProject(id).subscribe((data: any) => {
				let projectData = data.data;
				let startDate = this.dateFormate.transform(projectData.startDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
				this.addProjectForm.patchValue({
					clientName: projectData.clientName,
					email: projectData.email,
					projectCode: projectData.projectCode,
					projectDescription: projectData.projectDescription,
					projectId: projectData.projectId,
					projectManagerId: projectData.projectManagerId,
					projectManagerName: projectData.projectManagerName,
					projectName: projectData.projectName,
					projectStatus: projectData.projectStatus,
					startDate: startDate,
					status: projectData.status,
					technology: projectData.technology,
					
					
					/*projectId: projectData._id,
					projectCode :projectData.projectCode,
					code: projectData.code,
					projectName:projectData.projectName,
					clientName:projectData.clientName,
					projectManagerId:projectData.projectManagerId,
					startDate:projectData.startDate,
					technology:projectData.technology,
					projectStatus:projectData.projectStatus,
					projectDescription:projectData.projectDescription*/
				});
			}, err => {
				swal.fire('Error!', err.error.message, 'info');
			});
		}
	}
	
	ngOnInit(): void {
		const userRole = localStorage.getItem('loggedInUser');
		if (userRole) {
			this.getRole = JSON.parse(userRole)
		}
		
		this.apiService.getProjectManager().subscribe((data: any) => {
			this.projectManagerName = data.data;
		}, err => {
		});
	}
	
	// add-edit-project
	addProject(): any {
		if (this.getRole.roleName === 'Project Manager') {
			this.addProjectForm.patchValue({
				projectManagerId: this.getRole._id
			})
		}
		if (this.addProjectForm.valid) {
			this.helper.toggleLoaderVisibility(true)
			this.apiService.addEditProject(this.addProjectForm.value).subscribe((data: any) => {
				if (data.meta.status === 1) {
					this.setIsClicked()
					this.router.navigate(['/project-management']);
					swal.fire('', data.meta.message, 'success');
				} else {
					swal.fire('Info!', data.meta.message, 'info');
				}
				this.helper.toggleLoaderVisibility(false)
			}, (err) => {
				swal.fire('Error!', err.error.message, 'error');
			});
		}
	}
	
	space(event: any) {
		if (event.target.selectionStart === 0 && event.code === 'Space') {
			event.preventDefault();
		}
	}

	backToProjectList(){
		this.setIsClicked()
		this.router.navigate(['/project-management']).then();
	}

	setIsClicked(){
		localStorage.setItem('isClicked',JSON.stringify(true))
	}
	
}


