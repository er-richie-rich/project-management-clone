import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {from, Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {PMApiServicesService} from "../../services/PMApiServices.service";
import {Router} from "@angular/router";
import {filter} from 'rxjs/operators';
import swal from "sweetalert2";
import {PopupConfirmDeleteComponent} from "../popup/popup-confirm-delete/popup-confirm-delete.component";
import {ElementRef} from '@angular/core';
import {Renderer2} from '@angular/core';
import {PMHelperService} from "../../services/PMHelper.service";

export interface career {
	full_name: any;
	email: any;
	contact_no: any;
	job: any;
	experience: any;
	file: any;
	action2: any;
}

interface DataObject {
	[key: string]: any
}

@Component({
	selector: 'app-career',
	templateUrl: './career.component.html',
	styleUrls: ['./career.component.scss']
})
export class CareerComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('searchString') searchString!: ElementRef;
	@ViewChild('clearString') clearString!: ElementRef;
	salesLeads: any;
	dataSource: any = new MatTableDataSource([]);
	@ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
	@ViewChild(MatSort, {static: true}) sort!: MatSort;
	careerList: any;
	links: any;
	meta: any;
	pageSizeOptions: number[] = [10, 20, 30, 40, 50, 100];
	page = 1;
	size: any = 10;
	perPage: any = 10;
	currentPage = 1;
	requestBody: any = {};
	order: any;
	sort_by: any;
	isVisible: boolean = false;
	search: any;
	displayedColumns: string[] = ['action2', 'full_name', 'email', 'contact_no', 'job', 'experience'];
	
	constructor(
		public dialog: MatDialog,
		private apiService: PMApiServicesService,
		private router: Router,
		private renderer: Renderer2,
		private helper: PMHelperService
	) {
	}
	
	ngOnInit(): void {
		this.helper.removeIsClicked()
		this.careerListing({})
	}
	
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	
	ngOnDestroy(): void {
	}
	
	downloadFile = ($event: any) => {
		window.open($event, '_blank');
	}
	
	//Get Inquiry List
	careerListing(data: any) {
		let perPage = localStorage.getItem('perPage')
		if(perPage){
			this.perPage = perPage;
		}
		data.page = this.currentPage;
		data.per_page = this.perPage;
		if (this.search) {
			data.search = this.search;
		}
		if (this.order && this.sort_by) {
			data.order = this.order;
			data.sort_by = this.sort_by;
		}
		// if (this.currentPage) {
		//   data.page = this.currentPage;
		// }
		// if (this.perPage) {
		//   data.perPage = this.perPage;
		// }
		this.helper.toggleLoaderVisibility(true)
		this.apiService.careerLists(data).subscribe(
			data => {
				this.careerList = data.data;
				this.dataSource = new MatTableDataSource<career>(this.careerList)
				let isClicked = localStorage.getItem('isClicked');
				if(isClicked){
					this.goToPage()
				}
				localStorage.removeItem('isClicked')
				localStorage.removeItem('page')
				localStorage.removeItem('perPage')
				if(this.careerList.length === 0 && this.currentPage > 1){
					this.paginator?.previousPage()
				}
				this.links = data.links;
				this.meta = data.meta.total;
				this.helper.toggleLoaderVisibility(false)
			},
			error => {
			},
			() => {
			}
		)
	}

	goToPage() {
		let pageNumber = localStorage.getItem('page')
		if(pageNumber){
			this.paginator.pageIndex = +pageNumber;
			this.paginator.page.next({
				pageIndex: this.paginator.pageIndex,
				pageSize: this.paginator.pageSize,
				length: this.paginator.length
			});
		}
	}
	
	// Page Change Event
	pageChange(obj: any) {
		this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
		this.perPage = obj.pageSize;
		this.careerListing({});
	}

	candidateDetail(id:any){
		localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
		localStorage.setItem('perPage', this.perPage)
		this.router.navigate(['/candidate-detail/'+ id]);
	}
	
	// Delete Item
	deleteItem = (id: any, index: any) => {
		this.searchString.nativeElement.value = '';
		this.careerListing({})
		const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
			width: "500px",
			data: {message: 'Do you want to delete this candidate\'s resume?'}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.apiService.deleteCareerItems({id: id}).subscribe(
					data => {
						if (data && data?.meta) {
							if (data.meta.status == 1) {
								this.dataSource = new MatTableDataSource(this.dataSource.data);
								let metaData: any = data.meta.message;
								swal.fire(
									'Deleted!',
									metaData,
									'success'
								).then();
								this.careerListing({});
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
	
	//Apply Filter Item
	applyFilter(event: any) {
		if (event.target.selectionStart === 0 && event.code === 'Space') {
			event.preventDefault();
		} else {
			this.paginator?.firstPage();
			// this.dataSource.paginator.firstPage();
			// const filterValue = (event.target as HTMLInputElement).value;
			this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
			this.isVisible = this.search !== '';
			this.careerListing({})
		}
	}
	
	// applyFilter = (event: any) => {
	//   this.isVisible = true;
	//   if (this.dataSource.paginator) {
	//     this.dataSource.paginator.firstPage();
	//   }
	//   const filterValue = (event.target as HTMLInputElement).value;
	//   this.search = filterValue.trim().toLowerCase();
	//   this.currentPage = 1;
	//   this.careerListing({})
	// }
	
	
	// Sort Column function
	sortData(sort: Sort): void {
		var data: DataObject = {};
		if (sort.active && sort.direction) {
			this.order = sort.direction === 'asc' ? 'asc' : 'desc';
			'full_name' === sort.active ? this.sort_by = 'full_name' : '';
			'email' === sort.active ? this.sort_by = 'email' : '';
			'contact_no' === sort.active ? this.sort_by = 'contact_no' : '';
			'job' === sort.active ? this.sort_by = 'job' : '';
			'experience' === sort.active ? this.sort_by = 'experience' : '';
			data.order = this.order;
			data.sort_by = this.sort_by;
		}
		this.careerListing({})
	}
	
	//Clear Search Item
	clearSearch = (event: any) => {
		this.paginator?.firstPage();
		this.searchString.nativeElement.value = '';
		if (this.searchString.nativeElement.value === '') {
			this.isVisible = false;
			this.search = '';
		}
		this.careerListing({})
	}
	// clearSearch = (event: any) => {
	//   this.isVisible = true;
	//   this.search = '';
	//   this.searchString.nativeElement.value = '';
	//   if (this.searchString.nativeElement.value === '') {
	//     this.isVisible = false;
	//   }
	//   this.careerListing({})
	// }
	
	space(event: any) {
		if (event.target.selectionStart === 0 && event.code === 'Space') {
			event.preventDefault();
		}
	}
}
