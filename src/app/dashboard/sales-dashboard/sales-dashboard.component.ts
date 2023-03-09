import {Component, OnDestroy, OnInit, Output, ViewEncapsulation, EventEmitter} from '@angular/core';
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {Router} from "@angular/router";
import {PopupTodayActivitiesComponent} from "../../popup/popup-today-activities/popup-today-activities.component";
import swal from "sweetalert2";
import {MatDialog} from "@angular/material/dialog";
import {PopupYearlyLeaveListComponent} from "../../popup/popup-yearly-leave-list/popup-yearly-leave-list.component";

@Component({
	selector: 'app-sales-dashboard',
	templateUrl: './sales-dashboard.component.html',
	styleUrls: ['./sales-dashboard.component.scss']
})
export class SalesDashboardComponent implements OnInit, OnDestroy {
	@Output() leadStatus = new EventEmitter<any>();
	salesReport: any;
	totalLeads: any;
	salesLeads: any;
	roleName = "";
	authUser: any = {};
	totalUsers: any;
	superAdmin: any;
	bde: any;
	bdm: any;
	salesManagers: number = 0;
	totalWonLeads: any;
	open_leads: any;
	on_hold: any;
	scope_sent: any;
	proposal_sent: any;
	invoice_sent: any;
	lost_lead: any;
	hot_lead: any;
	totalHrManagers: any;
	totalProjectManagers: any;
	totalProjects: any;
	inProgressProjects: any;
	completedProjects: any;
	onHoldProjects: any;
	userManagementState: boolean = true;
	salesManagementState: boolean = true;
	projectManagementState: boolean = true;
	totalReport:number = 0;
	openReport:number = 0;
	closedReport:number = 0;
	totalTeamLeaders:number = 0;
	totalTeamMembers:number = 0;
	TotalLeavesToday:number =0;
	TotalWorkAnniversaryToday:number =0;
	TotalBirthdayToday:number =0;

	constructor(
		private apiService: PMApiServicesService,
		public router: Router,
		public dialog: MatDialog
	) {
		this.salesManagement({})
		let authUser: any = localStorage.getItem('loggedInUser');
		if (authUser) {
			this.authUser = JSON.parse(authUser);
			this.roleName = this.authUser.roleKey
		}
	}
	
	ngOnInit(): void {
	
	}
	
	ngOnDestroy(): void {
	}
	
	openUserManagement() {
		this.userManagementState = !this.userManagementState;
		this.salesManagementState = false;
		this.projectManagementState = false;
	}
	
	openSalesManagement() {
		this.salesManagementState = !this.salesManagementState;
		this.userManagementState = false;
		this.projectManagementState = false;
	}
	
	openProjectManagement() {
		this.projectManagementState = !this.projectManagementState;
		this.userManagementState = false;
		this.salesManagementState = false;
	}
	
	// Get leads
	salesManagement = (data: any) => {
		this.apiService.dashboardLeads(data).subscribe(
			data => {
				if (data && data?.meta && data.meta.status == 1) {
					this.salesReport = data.data;
					this.totalLeads = this.salesReport.totalLeads;
					this.open_leads = this.salesReport.openLeads;
					this.on_hold = this.salesReport.onHoldsLeads;
					this.scope_sent = this.salesReport.scopeSentLeads;
					this.proposal_sent = this.salesReport.proposalSentLeads;
					this.invoice_sent = this.salesReport.invoiceSentLeads;
					this.totalWonLeads = this.salesReport.wonLeads;
					this.lost_lead = this.salesReport.lostLeads;
					this.hot_lead = this.salesReport.hotLeads;
					this.totalUsers = this.salesReport.totalUsers;
					this.superAdmin = this.salesReport.adminUsers;
					this.bde = this.salesReport.businessDevelopmentExecutives;
					this.bdm = this.salesReport.businessDevelopmentManagers;
					this.salesManagers = this.salesReport.salesManagers;
					this.totalHrManagers = this.salesReport.totalHrManagers;
					this.totalProjectManagers = this.salesReport.totalProjectManagers;
					this.totalProjects = this.salesReport.TotalProjects;
					this.inProgressProjects = this.salesReport.InProgressProjects;
					this.completedProjects = this.salesReport.CompletedProjects;
					this.onHoldProjects = this.salesReport.OnHoldProjects;
					this.closedReport =  this.salesReport.closedReport;
					this.openReport =  this.salesReport.openReport;
					this.totalReport =  this.salesReport.totalReport;
					this.totalTeamLeaders =  this.salesReport.TeamLeaders;
					this.totalTeamMembers =  this.salesReport.TeamMembers;
					this.TotalLeavesToday =  this.salesReport.TotalLeavesToday;
					this.TotalWorkAnniversaryToday =  this.salesReport.TotalWorkAnniversaryToday;
					this.TotalBirthdayToday =  this.salesReport.TotalBirthdayToday;

				}
			},
			error => {
			},
			() => {
			}
		)
	}
	// reportInventoryManagement(){
	// 	this.router.navigateByUrl('/', {skipLocationChange: false})
	// 		.then(() => this.router.navigate([`/inventory-report-management/`], {
	// 			queryParams: {'reportStatus': 'All'},
	// 			skipLocationChange: false
	// 		}).then());
	// }
	//
	// reportInventoryManagementOpen(){
	// 	this.router.navigateByUrl('/', {skipLocationChange: false})
	// 		.then(() => this.router.navigate([`/inventory-report-management/`], {
	// 			queryParams: {'reportStatus': 'Open'},
	// 			skipLocationChange: false
	// 		}).then());
	// }
	// reportInventoryManagementClose(){
	// 	this.router.navigateByUrl('/', {skipLocationChange: false})
	// 		.then(() => this.router.navigate([`/inventory-report-management/`], {
	// 			queryParams: {'reportStatus': 'Closed'},
	// 			skipLocationChange: false
	// 		}).then());
	// }
	
	openLead(value: any) {
		this.router.navigate([`/sales-management/`], {
			queryParams: {'lead': 'open'}
		}).then()
	}
	
	scrappedLeads(value: any) {
		this.router.navigate([`/sales-management/`], {
			queryParams: {'lead': 'lost'}
		}).then()
	}
	
	totalLead(value: any) {
		this.router.navigate([`/sales-management/`], {
			queryParams: {'lead': 'all'}
		}).then()
	}
	
	closeLead(value: any) {
		this.router.navigate([`/sales-management/`], {
			queryParams: {'lead': 'won'}
		}).then()
	}
	
	hotLead(value: any) {
		this.router.navigate([`/sales-management/`], {
			queryParams: {'lead': 'hot-lead'}
		}).then()
	}
	
	onHold(value: any) {
		this.router.navigate([`/sales-management/`], {
			queryParams: {'lead': 'on-hold'}
		}).then()
	}
	
	scopeSent(value: any) {
		this.router.navigate([`/sales-management/`], {
			queryParams: {'lead': 'scope-sent'}
		}).then()
	}
	
	proposalSent(value: any) {
		this.router.navigate([`/sales-management/`], {
			queryParams: {'lead': 'proposal-sent'}
		}).then()
	}
	
	invoiceSent(value: any) {
		this.router.navigate([`/sales-management/`], {
			queryParams: {'lead': 'invoice-sent'}
		}).then()
	}
	
	
	noOfTotalUser = () => {
		this.router.navigate([`/user-management/`], {
			queryParams: {'user': 'All'}
		}).then()
	}
	
	noOfTotalSuperAdmin = () => {
		this.router.navigate([`/user-management/`], {
			queryParams: {'user': 'super-admin'}
		}).then()
	}
	
	noOfBDE = () => {
		this.router.navigate([`/user-management/`], {
			queryParams: {'user': 'BDE'}
		}).then()
	}
	
	noOfBDM = () => {
		this.router.navigate([`/user-management/`], {
			queryParams: {'user': 'BDM'}
		}).then()
	}
	
	noOfSalesManagers = () => {
		this.router.navigate([`/user-management/`], {
			queryParams: {'user': 'sales-managers'}
		}).then()
	}
	
	noOfHRManagers = () => {
		this.router.navigate([`/user-management/`], {
			queryParams: {'user': 'hr-managers'}
		}).then()
	}
	
	noOfProjectManagers = () => {
		this.router.navigate([`/user-management/`], {
			queryParams: {'user': 'project-managers'}
		}).then()
	}
	noOfTotalTeamLeaders = () => {
		this.router.navigate([`/user-management/`], {
			queryParams: {'user': 'Team Leader'}
		}).then()
	}
	noOfTotalTeamMembers = () => {
		this.router.navigate([`/user-management/`], {
			queryParams: {'user': 'Team Member'}
		}).then()
	}

	noOfProjects = () => {
		this.router.navigate([`/project-management/`], {
			queryParams: {'project': 'all'}
		}).then()
	}
	
	noOfInProgessProjects = () => {
		this.router.navigate([`/project-management/`], {
			queryParams: {'project': 'in progress'}
		}).then()
	}
	
	noOfCompletedProjects = () => {
		this.router.navigate([`/project-management/`], {
			queryParams: {'project': 'completed'}
		}).then()
	}
	
	noOfOnHoldProjects = () => {
		this.router.navigate([`/project-management/`], {
			queryParams: {'project': 'on hold'}
		}).then()
	}

	openTodayActivityPopup(msg:string,key:string){
		const dialogRef = this.dialog.open(PopupTodayActivitiesComponent, {
			width: "1000px",
			data: { message:msg,key:key}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				// this.getLeaveList({});
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

/*
projectStatus

all, in progress, completed, on hold*/
