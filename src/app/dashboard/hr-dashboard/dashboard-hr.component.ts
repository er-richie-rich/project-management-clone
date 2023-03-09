import {Component, OnInit} from '@angular/core';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import swal from "sweetalert2";
import {MatDialog} from "@angular/material/dialog";
import {PopupTodayActivitiesComponent} from "../../popup/popup-today-activities/popup-today-activities.component";
import {PopupYearlyLeaveListComponent} from "../../popup/popup-yearly-leave-list/popup-yearly-leave-list.component";

@Component({
	selector: 'app-dashboard-hr',
	templateUrl: './dashboard-hr.component.html',
	styleUrls: ['./dashboard-hr.component.scss']
})
export class DashboardHrComponent implements OnInit {
	roleName = "";
	authUser: any = {};
	dashboardData: any = {};
	
	constructor(private apiService: PMApiServicesService,  public dialog: MatDialog,) {
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

	openTodayActivityPopup(msg:string,key:string){
		const dialogRef = this.dialog.open(PopupTodayActivitiesComponent, {
			width: "1000px",
			data: { message:msg,key:key}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				swal.fire({
					icon: 'error',
					title: result.data.meta.message,
					showConfirmButton: false,
					timer: 2000
				});
			}
		});
	}

	openYearlyLeaveListPopup(msg:string,key:string){
		const dialogRef = this.dialog.open(PopupYearlyLeaveListComponent, {
			width: "1000px",
			data: { message:msg,key:key}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				swal.fire({
					icon: 'error',
					title: result.data.meta.message,
					showConfirmButton: false,
					timer: 2000
				});
			}
		});
	}
	
}
