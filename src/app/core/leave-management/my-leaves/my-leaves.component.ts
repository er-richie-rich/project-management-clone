import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import {MatDialog} from '@angular/material/dialog';
import swal from 'sweetalert2';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common'
import {PMHelperService} from "../../../../services/PMHelper.service";
import {Router} from "@angular/router";
import {CancelDeletePopupComponent} from "../../../popup/cancel-delete-popup/cancel-delete-popup.component";


@Component({
    selector: 'app-my-leaves',
    templateUrl: './my-leaves.component.html',
    styleUrls: ['./my-leaves.component.scss']
})
export class MyLeavesComponent implements OnInit {
    filterOwnLeaveDetailForm: FormGroup;
    pageSizeOptions: number[] = [10,20,30,40,50,100];
    page = 0;
    meta: any;
    todayDate :any;
    isValidDate :any;
    public currentPage = 1;
    perPage:any = 10;
    public requestPara = {};
    public filter: any;
    search: any;
    isVisible: boolean = false;
    sortBy: any = -1;
    sortKey: any;
    fromDate: any;
    toDate: any;
    filterLeaveType: any;
    leaveType: any = [
        {value: 'LWP'},
        {value: 'Casual'},
    ];
    leaveData: any;
    employeeName: any = [];
    headers: string[] = ['Action','Leave Type','Leave Duration','Leave Duration Detail', 'From Date', 'To Date', 'Total Taken Leaves','Available Balance', 'Leave Status'];
    columns: string[] = ['action','leaveType', 'leaveDuration','leaveDurationDetail', 'fromDate', 'toDate', 'totalTakenLeave','availableBalance', 'leaveStatus'];


    leaveColumns: string[] = ['action2','leaveType', 'leaveDuration','leaveDurationDetail', 'fromDate', 'toDate', 'totalTakenLeave','availableBalance', 'leaveStatus'];
    leaveDataSource: any = new MatTableDataSource([]);
    @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort!: MatSort
    @ViewChild('searchString') searchString!: ElementRef;
    private subject: Subject<string> = new Subject();



    constructor(private apiService: PMApiServicesService, private helper: PMHelperService,
                private _formBuilder: FormBuilder,
                public dialog: MatDialog,
                public datepipe: DatePipe,
                public router: Router) {
        this.filterOwnLeaveDetailForm = this._formBuilder.group({
            // name: [''],
            leaveType: [''],
            fromDate: [''],
            toDate: ['']
        });
    }


    //for serching

    ngOnInit(): void {
        this.helper.removeIsClicked()
        let dte = new Date();
        this.todayDate = dte.setDate(dte.getDate() - 1);
        this.getLeaveList({});
        // this.subject.pipe(debounceTime(500)).subscribe(searchTextValue => {
        //   this.applyFilter(searchTextValue);
        //   });
    }

//   applyFilter(filterValue: string) {
//     if (filterValue) {
//       filterValue = filterValue.trim();
//       filterValue = filterValue.toLowerCase()}
//       this.filter = filterValue;
//       this.leaveDataSource.data = [];
//       this.requestPara = {
//           search: filterValue,
//           limit: this.perPage,
//           page: this.currentPage,
// };
//     this. getLeaveList({});
//   }

    onKeyUp(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        } else {
            this.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
            this.isVisible = this.filter !== '';
            this.paginator?.firstPage();
            this.currentPage = 1;
            this.subject.next(event.target.value);
            this.getLeaveList({});
        }
    }

    clearSearch = (event: any) => {
        this.paginator.firstPage();
        this.searchString.nativeElement.value = '';
        if (this.searchString.nativeElement.value === '') {
            this.isVisible = false;
            this.filter = '';
        }
        this.getLeaveList({});
    }

    clearFilters() {
        this.leaveDataSource.data = [];
        this.filterOwnLeaveDetailForm === null;
    }

    ngOnDestroy(): void {
    }

    clearLeaveFilters() {
        this.fromDate = "";
        this.filterLeaveType = "";
        this.toDate = "";
        this.getLeaveList({})
    }

    getLeaveList = (req: any) => {
        let perPage = localStorage.getItem('perPage')
        if(perPage){
            this.perPage = perPage;
        }
        req.page = this.currentPage;
        req.limit = this.perPage;
        if (this.filter) {
            req.search = this.filter
        }
        if (this.fromDate) {
            req.fromDate = this.fromDate
        }
        if (this.filterLeaveType) {
            req.leaveType = this.filterLeaveType
        }
        if (this.sortBy && this.sortKey) {
            req.sortBy = this.sortBy;
            req.sortKey = this.sortKey;
        }
        if (this.toDate) {
            req.toDate = this.toDate
        }
        this.helper.toggleLoaderVisibility(true)
        this.apiService.myLeaveListing(req).subscribe((data: any) => {
            this.leaveData=data.data
            this.leaveDataSource = new MatTableDataSource(data.data);
            let isClicked = localStorage.getItem('isClicked');
            if(isClicked){
                this.goToPage()
            }
            localStorage.removeItem('isClicked')
            localStorage.removeItem('page')
            localStorage.removeItem('perPage')
            if(data.data.length === 0 && this.currentPage > 1){
                this.paginator?.previousPage()
            }
            this.meta = data.meta.totalCount;
            this.helper.toggleLoaderVisibility(false)
        });
    }

    pageChange = (obj: any) => {
        this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
        this.perPage = obj.pageSize;
        this.getLeaveList({});
    }

    cancelLeave(Id:any){
        const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
            width: "500px",
            data: {message: 'Are you sure you want to Cancel this leave?',key:"Cancel Leave",icon:"cancelImage.png"}
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.apiService.cancelLeave({leaveId:Id}).subscribe((data:any)=>{
                    if (data && data?.meta) {
                        if (data.meta.status == 1) {
                            let metaData: any = data.meta.message;
                            this.getLeaveList({})
                            // this.leaveDataSource = new MatTableDataSource<users>(this.leaveDataSource.data);
                            swal.fire(
                                'Cancelled!',
                                metaData,
                                'success'
                            ).then(() => {
                                // window.location.reload();
                            });
                        } else {
                            swal.fire(
                                '',
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
            } else {
            }
        });
    }

    sortData(sortKey: any, sortBy: any) {
        this.sortBy = (sortBy === -1) ? 1 : -1;
        this.sortKey = sortKey;
        this.getLeaveList({});
    }

    onfilterOwnLeaveDetail(): any {
            this.filterLeaveType = this.filterOwnLeaveDetailForm.value.leaveType;
            if(this.filterOwnLeaveDetailForm.value.fromDate){
                this.fromDate = this.filterOwnLeaveDetailForm.value.fromDate.getTime();
            }
            if(this.filterOwnLeaveDetailForm.value.toDate){
                this.toDate = this.filterOwnLeaveDetailForm.value.toDate.getTime();
            }
            this.getLeaveList({})
    }

    space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }

    leaveDetail(id:any){
        localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
        localStorage.setItem('perPage', this.perPage)
        this.router.navigate(['/leave-management/my-leave/leave-detail/'+ id]);
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
