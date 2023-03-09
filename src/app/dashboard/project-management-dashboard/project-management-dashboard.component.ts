import {Component, OnInit} from '@angular/core';
import {PMApiServicesService} from 'src/services/PMApiServices.service';

@Component({
	selector: 'app-project-management-dashboard',
	templateUrl: './project-management-dashboard.component.html',
	styleUrls: ['./project-management-dashboard.component.scss']
})
export class ProjectManagementDashboardComponent implements OnInit {
	roleName = "";
	authUser: any = {};
	dashboardData: any = {};
	
	constructor(private apiService: PMApiServicesService) {
		
		let authUser: any = localStorage.getItem('loggedInUser');
		if (authUser) {
			this.authUser = JSON.parse(authUser);
			this.roleName = this.authUser.roleKey
		}
	}
	
	ngOnInit(): void {
		this.apiService.dashboard().subscribe((data: any) => {
			
			this.dashboardData = data.data;
		}, err => {
			//this.toastr.error(err, 'Error');
		});
	}
	
}
