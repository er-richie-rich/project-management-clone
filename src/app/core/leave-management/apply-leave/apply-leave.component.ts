import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthServiceService} from 'src/services/auth-service.service';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import {PMHelperService} from 'src/services/PMHelper.service';
import swal from 'sweetalert2';
import * as moment from 'moment';


@Component({
	selector: 'app-apply-leave',
	templateUrl: './apply-leave.component.html',
	styleUrls: ['./apply-leave.component.scss']
})

export class ApplyLeaveComponent implements OnInit {
	userId = localStorage.getItem('loginId');
	leaveTypeSelected: boolean = false;
	selectedLeaveType: any;
	LWPLeaveBalance: any;
	casualLeaveBalance: any;
	sickLeaveBalance: any;
	disableField:boolean=false;
	applyLeaveForm: FormGroup;
	leaveType: any = [
		{value: 'LWP'},
		{value: 'Casual'},
		{value: 'Sick'},
	];
	selectDuration: any = [
		{value: 'Full Day', valueName: 'Full-Day'},
		{value: 'Half Day', valueName: 'Half-Day'}
	]
	selectDurationDetails: any = [
		{value: 'First half', valueName: 'First-Half'},
		{value: 'Second half', valueName: 'Second-Half'}
	]
	currentDate: any = new Date();
	minDate: any;
	fromDate: any = new Date();
	maxToDate: any = new Date();
	toDate: any = new Date();
	totalLeaveDaysApplied: any;
	isWeekEnd:boolean=false
	holidayList:any=[];
	/**
	 *
	 * @param _formBuilder
	 * @param authService
	 * @param apiService
	 * @param router
	 * @param route
	 * @param helper
	 */
	constructor(
		public _formBuilder: FormBuilder,
		public authService: AuthServiceService,
		public apiService: PMApiServicesService,
		public router: Router,
		public route: ActivatedRoute,
		public helper: PMHelperService,
	) {
		this.applyLeaveForm = this._formBuilder.group({
			userId: [this.userId],
			leaveStatus: ["Pending"],
			leaveType: ['', Validators.required],
			leaveDurationDetail: ['', Validators.required],
			leaveDuration: [''],
			fromDate: ['', [Validators.required,this.dateValidator]],
			toDate: ['', Validators.required],
			leaveReason: ['', Validators.required],
		});
	}
	
	ngOnInit(): void {
		this.getLeaveBalance({})
		let minDay = this.currentDate.getDate();
		let minMonth = this.currentDate.getMonth();
		let minYear = this.currentDate.getFullYear();
		this.minDate = new Date(minYear, minMonth, minDay);
		let data = {}
		this.apiService.getHolidaysList(data).subscribe((res:any)=>{
			if (res && res?.meta && res.meta.status == 1) {
				for (let i in res.data) {
					this.holidayList.push( res.data[i].holidayDate)
				}
			}})
	}
	/**
	 *
	 * @param req
	 */
	getLeaveBalance(req: any): any {
		req.userId = null;
		this.apiService.viewLeaveBalance(req).subscribe((data: any) => {
			if (data && data?.meta && data.meta.status == 1) {
				this.LWPLeaveBalance = data.data.LWPLeaveBalance;
				this.casualLeaveBalance = data.data.casualLeaveBalance;
				this.sickLeaveBalance = data.data.sickLeaveBalance;
			}
		});
	}
	
	/**
	 *
	 * @param event
	 */
	getFromDate(event: any) {
		this.maxToDate = new Date();
		if (this.selectedLeaveType === 'Casual') {
			if((this.casualLeaveBalance === 0.5)){
				this.maxToDate = event.target.value
			}else {
				let minDay = event.target.value.getDate() + this.casualLeaveBalance - 1;
				let minMonth = event.target.value.getMonth();
				let minYear = event.target.value.getFullYear();
				this.maxToDate = new Date(minYear, minMonth, minDay);
			}
		}
		if (this.selectedLeaveType === 'LWP') {
			if((this.LWPLeaveBalance === 0.5)){
				this.maxToDate = event.target.value
			}else{
				let minDay = event.target.value.getDate() + this.LWPLeaveBalance - 1;
				let minMonth = event.target.value.getMonth();
				let minYear = event.target.value.getFullYear();
				this.maxToDate = new Date(minYear, minMonth, minDay);
			}

		}
		if(this.selectedLeaveType === 'Sick') {
				this.maxToDate = event.target.value
				let minDay = event.target.value.getDate() + 2;
				let minMonth = event.target.value.getMonth();
				let minYear = event.target.value.getFullYear();
				this.maxToDate = new Date(minYear, minMonth, minDay);
		}
		this.fromDate = event.target.value;
	}

	dateValidator(control: FormControl): { [p: string]: boolean } | null {
		if (control.value) {
			let day = control.value.getDay()
			if ([6,0].includes(day) ){
				return { 'invalidDate': true }
			}
		}
		return null ;
	}
	datesFilter = (d: Date | null): boolean => {
		const day = d?.getDay();
		const date = d?.getTime()
		return day !== 0 && day !== 6  && !this.holidayList.find((x:any)=>x==date);;
	};
	/**
	 *
	 * @param event
	 */
	getToDate(event: any) {
		this.toDate = event.target.value;
	}
	
	/**
	 *
	 * @param leaveType
	 */
	leaveTypeChanged(leaveType: any) {
		if(leaveType === 'LWP' && this.LWPLeaveBalance === 0|| leaveType === 'Casual' && this.casualLeaveBalance === 0 ){
			this.disableField = true;
			swal.fire(
				'Oops!',
				"You have insufficient leave balance. Please contact HR department.",
				'info'
			).then();
		}else{
			this.disableField = false;
		}
		this.selectedLeaveType = leaveType
		this.leaveTypeSelected = true;
		this.applyLeaveForm.reset()
		this.applyLeaveForm.patchValue({
			leaveType: this.selectedLeaveType,
			leaveStatus: "Pending"
		})
	}
	
	// on apply leave
	onApplyLeave(): any {
		if (this.applyLeaveForm.value.leaveDuration === 'Full Day') {
			this.applyLeaveForm.patchValue({
				leaveDurationDetail: 'Full Day'
			})
		}
		if (this.applyLeaveForm.valid){
			var start = moment(this.toDate, "YYYY-MM-DD");
			var end = moment(this.fromDate, "YYYY-MM-DD");
			var daysDifferance = moment.duration(start.diff(end)).asDays() + 1
			this.totalLeaveDaysApplied = this.applyLeaveForm.value.leaveDuration === 'Half Day' ? daysDifferance/2 : daysDifferance;
			if ((this.applyLeaveForm.value.leaveType === 'LWP' && this.totalLeaveDaysApplied > this.LWPLeaveBalance) || (this.applyLeaveForm.value.leaveType === 'Casual' && this.totalLeaveDaysApplied > this.casualLeaveBalance)) {
				swal.fire(
					'Oops!',
					"You have insufficient leave balance. Please contact HR department.",
					'info'
				).then();
			} else {
				this.helper.toggleLoaderVisibility(true)
				this.apiService.applyLeave(this.applyLeaveForm.value).subscribe((data: any) => {
					this.router.navigate(['/leave-management/my-leave']);
					if (data.meta.status === 0) {
						swal.fire('Error!', data.meta.message, 'info');
					} else {
						swal.fire('', data.meta.message, 'success');
					}
					// swal.fire('', data.meta.message, 'success');
					this.helper.toggleLoaderVisibility(true)
				}, (err) => {
					swal.fire('Error!', err.error.message, 'info');
				});
			}
		}
	}
	/**
	 *
	 * @param event
	 */
	space(event: any) {
		if (event.target.selectionStart === 0 && event.code === 'Space') {
			event.preventDefault();
		}
	}
}
