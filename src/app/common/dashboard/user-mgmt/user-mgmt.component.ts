import {Component, OnInit} from '@angular/core';
import {PMApiServicesService} from "../../../../services/PMApiServices.service";

export interface leads {
	id: number;
	name: string;
	number: number;
	icon: string;
	backImg: any;
	backColor: string;
}

@Component({
	selector: 'app-user-mgmt',
	templateUrl: './user-mgmt.component.html',
	styleUrls: ['./user-mgmt.component.scss']
})
export class UserMgmtComponent implements OnInit {
	userManagement: any;
	
	constructor(public apiService: PMApiServicesService) {
	}
	
	ngOnInit(): void {
		this.getUserManagementData()
	}
	
	getUserManagementData() {
		this.apiService.dashboard().subscribe(
			data => {
				if (data && data?.meta && data.meta.status == 1) {
					this.userManagement = data.data;
				}
			},
			data => {
			},
			() => {
			
			}
		)
	}
}
