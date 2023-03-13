import {Component, OnInit,} from '@angular/core';
import {PMApiServicesService} from "../../../../services/PMApiServices.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import swal from "sweetalert2";
import {Location} from "@angular/common";
import {CancelDeletePopupComponent} from "../../../popup/cancel-delete-popup/cancel-delete-popup.component";

@Component({
	selector: 'app-view-candidate',
	templateUrl: './view-candidate.component.html',
	styleUrls: ['./view-candidate.component.scss']
})
export class ViewCandidateComponent implements OnInit {
	careerId: any;
	career: any;
	fullName: any;
	email: any;
	contactNumber: any;
	document: any;
	jobTitle: any;
	experience: any;
	
	constructor(
		private apiService: PMApiServicesService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		public dialog: MatDialog,
		private location:Location
	) {
	}
	
	ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
				this.careerId = params.id;
			}
		)
		this.viewCareerDetail()
	}

	backToCareerList(){
		this.setIsClicked()
		this.location.back()
	}

	setIsClicked(){
		localStorage.setItem('isClicked',JSON.stringify(true))
	}
	
	
	// Delete Item
	deleteItem = () => {
		const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
			width: "500px",
			data: {message: 'Do you want to delete this candidate\'s resume?',key:"Delete Candidate\'s Resume",icon:"delete-icon.png"}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.apiService.deleteCareerItems({id: this.careerId}).subscribe(
					data => {
						if (data && data?.meta) {
							if (data.meta.status == 1) {
								let metaData: any = data.meta.message;
								swal.fire(
									'Deleted!',
									metaData,
									'success'
								).then();
								this.router.navigate([`/career/`]).then()
							} else {
								swal.fire(
									'Error!',
									data.meta.message,
									'error'
								).then();
							}
						} else {
							swal.fire(
								'Error!',
								"Server Error",
								'error'
							).then();
						}
					}
				)
			}
		})
	}
	
	//View Detail
	viewCareerDetail = () => {
		this.apiService.viewCareerDetail({id: this.careerId}).subscribe(
			(data) => {
				this.career = data.data;
				this.fullName = this.career.full_name;
				this.email = this.career.email;
				this.contactNumber = this.career.contact_no;
				this.document = this.career.file;
				this.jobTitle = this.career.job;
				this.experience = this.career.experience;
			},
			() => {
			},
			() => {
			}
		)
	}
	//Download File
	downloadFile = ($event: any) => {
		window.open($event, '_blank');
	}
}
