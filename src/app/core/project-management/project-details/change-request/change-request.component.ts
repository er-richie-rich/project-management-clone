import {Component, OnInit, ViewChild} from '@angular/core';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {PMHelperService} from "../../../../../services/PMHelper.service";
import {MatPaginator} from "@angular/material/paginator";
import {CancelDeletePopupComponent} from "../../../../popup/cancel-delete-popup/cancel-delete-popup.component";


@Component({
    selector: 'app-change-request',
    templateUrl: './change-request.component.html',
    styleUrls: ['./change-request.component.scss']
})
export class ChangeRequestComponent implements OnInit {
    projectId: string | null = "0";
    pageSizeOptions: number[] = [10, 20, 30, 40, 50, 100];
    page = 0;
    size: any = 10;
    perPage: any = 10;
    currentPage = 1;
    meta: number = 0
    changeRequest: any;
    @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

    // changeRequestColumns: string[] = ['action', 'title', 'version', 'description', 'estimation', 'receiveDate'];
    columns: string[] = ['action', 'title', 'version', 'description', 'estimation', 'receiveDate'];
    headers: string[] = ['Action', 'Title', 'Version', 'Description', 'Estimation', 'Receive Date'];
    dateFields:string[]=['receiveDate'];
    changeRequestDataSource: any = new MatTableDataSource([]);

    constructor(private router: Router, private helper: PMHelperService,
                public dialog: MatDialog,
                private apiService: PMApiServicesService,
                public route: ActivatedRoute) {
        this.projectId = this.route.snapshot.paramMap.get('id') || null;

    }

    ngOnInit(): void {
        this.helper.removeIsClicked()
        this.getChangeRequestList({});
    }

    getChangeRequestList(req: any) {
        let perPage = localStorage.getItem('perPage')
        if(perPage){
            this.perPage = perPage;
        }
        req.page = this.currentPage;
        req.limit = this.perPage;
        req.projectId = this.projectId;
        this.helper.toggleLoaderVisibility(true)
        this.apiService.changeRequestList(req).subscribe((data: any) => {
            if(data.meta.status === 1){
                this.changeRequest = data.data;
                this.meta = data.meta.totalCount
                this.changeRequestDataSource = new MatTableDataSource(this.changeRequest);
                let isClicked = localStorage.getItem('isClicked');
                if(isClicked){
                    this.goToPage()
                }
                localStorage.removeItem('isClicked')
                localStorage.removeItem('page')
                localStorage.removeItem('perPage')
                if (this.changeRequest.length === 0 && this.currentPage > 1) {
                    this.paginator?.previousPage()
                }
                this.helper.toggleLoaderVisibility(false)
            }
        })
    }

    goToPage() {
        let pageNumber = localStorage.getItem('page')
        console.log(pageNumber)
        if(pageNumber){
            this.paginator.pageIndex = +pageNumber;
            this.paginator.page.next({
                pageIndex: this.paginator.pageIndex,
                pageSize: this.paginator.pageSize,
                length: this.paginator.length
            });
        }
    }

    editChangeRequest(id: string) {
        localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
        localStorage.setItem('perPage', this.perPage)
        this.router.navigate([`/project-management/project-details/add-change-request/${this.projectId}/${id}`]);
    }

    deleteChangeRequest(id: any){
        const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
            width: "500px",
            data: {message: 'Are you sure you want to delete this change request?',key:"Delete Change Request",icon:"delete-icon.png"}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.apiService.deleteChangeRequest(id).subscribe((data: any) => {
                    let metaData: any = data.meta.message;
                    // this.changeRequestDataSource.data.splice(index, 1);
                    this.changeRequest = data.data;
                    this.changeRequestDataSource = new MatTableDataSource(this.changeRequest);
                    swal.fire(
                        'Deleted!',
                        metaData,
                        'success'
                    );
                    this.getChangeRequestList({});
                }, (err: any) => {
                    const e = err.error;
                    if (e.statusCode !== 401) {
                        swal.fire(
                            'Error!',
                            err.error.message,
                            'info'
                        );
                    }
                });
            }
        });
    }

    pageChange = (obj: any) => {
        this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
        this.perPage = obj.pageSize;
        this.getChangeRequestList({});
    }
}
