import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {from, Subject, Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {PMApiServicesService} from "../../services/PMApiServices.service";
import swal from "sweetalert2";
import {PopupConfirmDeleteComponent} from "../popup/popup-confirm-delete/popup-confirm-delete.component";
import {ElementRef} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {DatePipe} from "@angular/common";
import {saveAs} from "file-saver";
import Swal from 'sweetalert2';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {PopupImportInquiryComponent} from "../popup/popup-import-inquiry/popup-import-inquiry.component";
import {PMHelperService} from "../../services/PMHelper.service";


export interface inquiry {
	id: any;
	service_type: any;
	full_name: any;
	email: any;
	contact_no: any;
	additional_info: any;
	file: any;
	action2: any;
	selectall: any;
}

interface DataObject {
	[key: string]: any
}

@Component({
	selector: 'app-inquiry',
	templateUrl: './inquiry.component.html',
	styleUrls: ['./inquiry.component.scss'],
})
export class InquiryComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('searchString') searchString!: ElementRef;
	@ViewChild('clearString') clearString!: ElementRef;
	salesLeads: any;
	dataSource: any = new MatTableDataSource([]);
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort, {static: true}) sort!: MatSort;
	inquiryList: any;
	isDisabled: boolean = true;
	links: any;
	meta: any;
	pageSizeOptions: number[] = [10, 20, 30, 40, 50, 100];
	page = 1;
	size: any = 10;
	perPage: any = 10;
	currentPage = 1;
	sortedData!: inquiry[];
	requestBody: any = {};
	order: any;
	sort_by: any;
	isVisible: boolean = false;
	search: any;
	inquiryLeadId: any;
	url: any;
	context: any;
	fileName: any;
	numSelected: any;
	numRows: any;
	displayedColumns: string[] = ['selectall', 'action2', 'service_type', 'full_name', 'email', 'contact_no'];
	//////////////////////////////////////////////////////////////////
	selection = new SelectionModel<inquiry>(true, []);
	
	constructor(
		public dialog: MatDialog,
		private apiService: PMApiServicesService,
		private http: HttpClient,
		private router: ActivatedRoute,
		private route: Router,
		private helper: PMHelperService
	) {
	}
	
	ngOnInit(): void {
		this.helper.removeIsClicked()
		this.inquiryListing({})
	}
	
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
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

	ngOnDestroy(): void {
	}
	
	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected = () => {
		this.numSelected = this.selection.selected.length;
		this.numRows = this.dataSource.data.length;
		this.inquiryLeadId = this.dataSource.data.filter((e: inquiry) => this.selection.isSelected(e)).map((e: { id: any; }) => e.id);
		return this.numSelected === this.numRows;
	}
	
	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle = ($event: any) => {
		if($event.checked){
			this.dataSource.data.forEach((row: inquiry) => this.selection.select(row));
		} else {
			this.selection.clear()
			this.inquiryLeadId = null
		}
	}
	
	deleteRow = () => {
		if (this.inquiryLeadId === null) {
			swal.fire(
				'',
				"Please select at least one row to delete",
				'info'
			).then();
		} else {
			const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
				width: "500px",
				data: {message: 'Are you sure you want to delete this Inquiry?'}
			});
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.apiService.inquiryDeleteRows({inquiryIds: this.inquiryLeadId}).subscribe(
						data => {
							if (data && data?.meta) {
								if (data.meta.status == 1) {
									this.dataSource = new MatTableDataSource(this.dataSource.data);
									let metaData: any = data.meta.message;
									swal.fire(
										'Deleted!',
										metaData,
										'success'
									).then(() => {
										// window.location.reload();
									});
									this.selection.clear();
									this.inquiryListing({});
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
				} else {
					this.selection.clear();
					window.location.reload();
				}
			})
		}
	}
	exportAllLeads = () => {
		this.apiService.exportAllInquiry({inquiryIds: this.inquiryLeadId}).subscribe(
			data => {
				if (data && data?.meta) {
					if (data.meta.status == 1) {
						this.url = data.data.url;
						const date = new DatePipe('en-US').transform(new Date(), 'ddMMyy');
						const filename = 'inquiry_' + date + '.xlsx';
						saveAs.saveAs(this.url, filename);
						this.dataSource = new MatTableDataSource(this.dataSource.data);
						swal.fire(
							'Exported!',
							data.meta.message,
							'success'
						).then(()=>{
							this.inquiryLeadId = null;
						});
						this.inquiryListing({})
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
	/////////////////////////////////////////////////////////////////
	downloadFile = ($event: any) => {
		window.open($event, '_blank');
	}
	
	//Get Inquiry List
	inquiryListing(data: any) {
		let perPage = localStorage.getItem('perPage')
		if(perPage){
			this.perPage = perPage;
		}
		data.page = this.currentPage;
		data.per_page = this.perPage;
		if (this.order && this.sort_by) {
			data.order = this.order;
			data.sort_by = this.sort_by;
		}
		if (this.search) {
			data.search = this.search;
		}
		this.helper.toggleLoaderVisibility(true)
		this.apiService.inquiryLists(data).subscribe(data => {
				if (data && data?.meta && data.meta.status == 1) {
					this.inquiryList = data.data;
					this.inquiryList.length > 0 ? this.isDisabled = false : this.isDisabled = true;
					this.dataSource = new MatTableDataSource<inquiry>(this.inquiryList)
					let isClicked = localStorage.getItem('isClicked');
					if(isClicked){
						this.goToPage()
					}
					localStorage.removeItem('isClicked')
					localStorage.removeItem('page')
					localStorage.removeItem('perPage')
					if(this.inquiryList.length === 0 && this.currentPage > 1){
						this.paginator?.previousPage()
					}
					this.links = data.links;
					this.meta = data.meta.total;
					this.helper.toggleLoaderVisibility(false)
				}
			}
		)
	}
	
	// Page Change Event
	pageChange(obj: any) {
		window.scrollTo({top:0});
		this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
		this.perPage = obj.pageSize;
		this.selection.clear()
		this.inquiryLeadId = null
		this.inquiryListing({});
	}
	
	// Delete Item
	deleteItem = (id: any) => {
		this.searchString.nativeElement.value = '';
		const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
			width: "500px",
			data: {message: 'Are you sure you want to delete this inquiry?'}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.apiService.deleteInquiryLists({id: id}).subscribe(
					data => {
						if (data && data?.meta) {
							if (data.meta.status == 1) {
								this.dataSource = new MatTableDataSource(this.dataSource.data);
								this.inquiryListing({});
								swal.fire(
									'Deleted!',
									data.meta.message,
									'success'
								).then();
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

	inquiryDetail(id:any){
		localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
		localStorage.setItem('perPage', this.perPage)
		this.route.navigate(['/inquiry/inquiry-detail/' + id])
	}

	//Search Item
	// applyFilter = (event: any) => {
	//   this.isVisible = true;
	//   if (this.dataSource.paginator) {
	//     this.dataSource.paginator.firstPage();
	//   }
	//   const filterValue = (event.target as HTMLInputElement).value;
	//   this.search = filterValue.trim().toLowerCase();
	//   this.currentPage = 1;
	//   this.inquiryListing({})
	// }
	
	applyFilter(event: any) {
		if (event.target.selectionStart === 0 && event.code === 'Space') {
			event.preventDefault();
		} else {
			this.paginator?.firstPage();
			// this.dataSource.paginator.firstPage();
			// const filterValue = (event.target as HTMLInputElement).value;
			this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
			this.isVisible = this.search !== '';
			this.inquiryListing({})
		}
	}
	
	// Sort Column function
	sortData(sort: Sort): void {
		var data: DataObject = {};
		if (sort.active && sort.direction) {
			this.order = sort.direction === 'asc' ? 'asc' : 'desc';
			'service_type' === sort.active ? this.sort_by = 'service_type' : '';
			'full_name' === sort.active ? this.sort_by = 'full_name' : '';
			'email' === sort.active ? this.sort_by = 'email' : '';
			'contact_no' === sort.active ? this.sort_by = 'contact_no' : '';
			data.order = this.order;
			data.sort_by = this.sort_by;
		}
		this.inquiryListing(data)
	}

	//Clear Search Item
	clearSearch = (event: any) => {
		this.paginator?.firstPage();
		this.searchString.nativeElement.value = '';
		if (this.searchString.nativeElement.value === '') {
			this.isVisible = false;
			this.search = '';
		}
		this.inquiryListing({})
	}

	importInquiryData = () => {
		const dialogRef = this.dialog.open(PopupImportInquiryComponent, {
			width: "600px",
			disableClose: true
		});
		dialogRef.afterClosed().subscribe(result => {
			if(result){
				const formData = new FormData();
				formData.append("file", result)
				this.apiService.importAllInquiry(formData).subscribe(
					data => {
						if (data && data?.meta) {
							if (data.meta.status == 1) {
								this.dataSource = new MatTableDataSource(this.dataSource.data);
								let metaData: any = data.meta.message;
								this.inquiryListing({});
								swal.fire({
										title: 'Success!',
										icon: 'success',
										html:
											data.meta.message +
											'<div class="mt-3 py-2 alert alert-success" role="alert">\n' +
											+data.data.successCount + '  Records are imported successfully.\n' +
											'</div>' +
											'<div class="mt-3 py-2 alert alert-danger" role="alert">\n' +
											+data.data.failCount + '  Records are failed to import.\n' +
											'</div>'
									}
								).then();
								this.selection.clear()
							} else {
								swal.fire(
									'Error!',
									data.meta.message,
									'error'
								).then();
								this.selection.clear()
							}
						} else {
							Swal.fire(
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

	space(event: any) {
		if (event.target.selectionStart === 0 && event.code === 'Space') {
			event.preventDefault();
		}
	}
}
