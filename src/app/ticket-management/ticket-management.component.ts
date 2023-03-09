import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PopupConfirmDeleteComponent} from "../popup/popup-confirm-delete/popup-confirm-delete.component";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {SelectionModel} from '@angular/cdk/collections';
import {PMApiServicesService} from "../../services/PMApiServices.service";
import {PMHelperService} from "../../services/PMHelper.service";
import {PopupUpdateStatusComponent} from "../popup/popup-update-status/popup-update-status.component";
import {PopupCancelLeaveComponent} from "../popup/popup-cancel-leave/popup-cancel-leave.component";
//
// interface DataObject {
//   [key: string]: any
// }
//


export interface projects {

    status: any;
    action2: string;
    userName?: any;
    email?: any;
    ticketCode: any;
    urgency: string;
    subject: string;
    message: string;
}

interface DataObject {
    [key: string]: any
}

@Component({
    selector: 'app-ticket-management',
    templateUrl: './ticket-management.component.html',
    styleUrls: ['./ticket-management.component.scss']
})

export class TicketManagementComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('searchString') searchString!: ElementRef;
    @ViewChild('clearString') clearString!: ElementRef;
    @ViewChild('hotLeads') hotLeads!: ElementRef;
    pageSizeOptions: number[] = [10, 20, 30, 40, 50, 100];
    page = 1;
    size: any = 5;
    perPage: any = 10;
    currentPage = 1;
    requestBody: any = {};
    sortBy: any = -1;
    sortKey: any;
    tickets: any;
    search: any;
    user: any;
    userRole: any
    isNetworkEngineer: boolean = false;
    dataSource: any = new MatTableDataSource([]);
    @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort!: MatSort;
    selectedValue: any = 'all';
    isDisabled: boolean = true;
    subCategory: any[] = [];
    category: any[] = [];
    isVisible: boolean = false
    name: any;
    image: any;
    email: any;
    meta: any;
    activeSort: any;
    directionSort: any;
    selectedProjectId: any;
    url: any;
    projectStatus: any = 'all';
    messageCount: number = 0;
    displayedColumns: string[] = [
        'selectAll',
        'action2',
        'ticketCode',
        'userName',
        'email',
        'urgency',
        'subject',
        'status',
    ];
    //////////////////////////////////////////////////////////////////
    selection = new SelectionModel<projects>(true, []);

    constructor(
        private apiService: PMApiServicesService,
        public dialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        private router: Router,
        private helper: PMHelperService
    ) {
        this.user = JSON.parse(localStorage.getItem('loggedInUser') || '{}')
        if (this.user) {
            this.userRole = this.user.roleKey
            if (this.userRole === 'NETWORKENGINEER') {
                this.isNetworkEngineer = true;
                this.displayedColumns = [
                    'action2', 'ticketCode', 'userName', 'email', 'urgency', 'subject', 'status',
                ];
            } else if (this.userRole !== 'SUPERADMINS') {
                this.isNetworkEngineer = false;
                this.displayedColumns = [
                    'action2', 'ticketCode', 'urgency', 'subject', 'status',
                ];
            }
        }
    }

    ngOnInit(): void {
        this.helper.removeIsClicked()
        var data: DataObject = {};
        this.getTicketList(data);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy(): void {
    }

    // Get Project list
    getTicketList = (data: any) => {
        let perPage = localStorage.getItem('perPage')
        if(perPage){
            this.perPage = perPage;
        }
        data.page = this.currentPage;
        data.limit = this.perPage;
        if (this.selectedValue) {
            data.projectStatus = this.selectedValue;
        }
        if (this.sortBy && this.sortKey) {
            data.sortBy = this.sortBy;
            data.sortKey = this.sortKey;
        }

        if (this.search) {
            data.search = this.search;
        }
        this.helper.toggleLoaderVisibility(true)
        this.apiService.ticketList(data).subscribe((data: any) => {
            if (data && data?.meta && data.meta.status == 1) {
                this.tickets = data.data
                this.dataSource = new MatTableDataSource<projects>(this.tickets)
                let isClicked = localStorage.getItem('isClicked');
                if(isClicked){
                    this.goToPage()
                }
                localStorage.removeItem('isClicked')
                localStorage.removeItem('page')
                localStorage.removeItem('perPage')
                if(this.tickets.length === 0 && this.currentPage > 1){
                    this.paginator?.previousPage()
                }
                this.meta = data.meta.totalCount;
                this.messageCount = data.meta.unReadCount;
                this.meta === 0 ? this.isDisabled = true : this.isDisabled = false;
                this.helper.toggleLoaderVisibility(false)
                this.helper.messageCount.next(data.meta.unReadCount)
            }
        })
    }
    // set local storage
    setLocalStorage(){
        localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
        localStorage.setItem('perPage', this.perPage)
    }
    // category
    filterByLeadStatus = (value: any) => {
        this.selectedValue = value;
        this.getTicketList({});
    }

    // Filter for Search
    applyFilter(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        } else {
            this.paginator.firstPage();
            // const filterValue = (event.target as HTMLInputElement).value;
            this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
            this.isVisible = this.search !== '';
            this.getTicketList({});
        }
    }

    clearSearch = (event: any) => {
        this.paginator.firstPage();
        this.searchString.nativeElement.value = '';
        if (this.searchString.nativeElement.value === '') {
            this.isVisible = false;
            this.search = '';
        }
        this.getTicketList({});
    }


    pageChange = (obj: any) => {
        this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
        this.perPage = obj.pageSize;
        this.getTicketList({});
    }


    editTicket = (ticketId: string, ticketStatus: string) => {
        if (ticketStatus === 'Open'){
            this.setLocalStorage()
            this.router.navigate(['/ticket-management/add-edit-ticket/'+ ticketId])
        } else {
         swal.fire({
             title:'Oops...',
             text: 'You can\'t edit this ticket because this ticket has been already '+ticketStatus+'.',
             icon:'info'
         })
        }
    }


    viewTicket(ticketId: string,){
        this.setLocalStorage()
        this.router.navigate(['/ticket-management/ticket-details/'+ ticketId])
    }

    deleteTicket = (ticketId: any) => {
        this.apiService.getTicket(ticketId).subscribe(data => {
            let ticketData = data.data
            if (ticketData.ticketStatus === 'Cancelled') {
                this.searchString.nativeElement.value = '';
                const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
                    width: "500px",
                    data: {message: 'Are you sure you want to delete this ticket?'}
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        this.apiService.deleteTicket(ticketId).subscribe(
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
                                            this.getTicketList({})
                                        });

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
                    this.getTicketList({})
                })
            } else {
                swal.fire(
                    'Error!',
                    'You can not delete this ticket ! Because your ticket has not been cancelled. ',
                    'error',
                ).then();
            }
        })


    }

    markAsResolved(ticketId: any) {
        const dialogRef = this.dialog.open(PopupUpdateStatusComponent, {
            width: "500px",
            data: {message: 'Are you sure! ticket has been resolved?', key:'resolve'}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.apiService.markAsResolve(ticketId).subscribe((data: any) => {
                    if (data && data?.meta) {
                        if (data.meta.status == 1) {
                            let metaMassgae = data.meta.message;
                            swal.fire({
                                icon: 'success',
                                title: metaMassgae,
                            });
                            this.getTicketList({})
                        } else {
                            swal.fire(
                                'Error!',
                                data.meta.message,
                                'error'
                            );
                        }
                    } else {
                        swal.fire(
                            'Error!',
                            "Server Error",
                            'error'
                        );
                    }
                })
            }
        })
    }

    cancelTicket(ticketId: any) {
        const dialogRef = this.dialog.open(PopupCancelLeaveComponent, {
            width: "500px",
            data: {message: 'Are you sure! you want to cancel this ticket?', key:'cancelTicket'}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.apiService.cancleTicket(ticketId).subscribe((data: any) => {
                    if (data && data?.meta) {
                        if (data.meta.status == 1) {
                            let metaMassgae = data.meta.message;
                            swal.fire({
                                icon: 'success',
                                title: metaMassgae,
                            });
                            this.getTicketList({})
                        } else {
                            swal.fire(
                                'Error!',
                                data.meta.message,
                                'error'
                            );
                        }
                    } else {
                        swal.fire(
                            'Error!',
                            "Server Error",
                            'error'
                        );
                    }
                })
            }
        })
    }

    sortData(sortKey: any, sortBy: any) {
        this.sortBy = (sortBy === -1) ? 1 : -1;
        this.sortKey = sortKey;
        this.getTicketList({});
    }

    space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
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



}

