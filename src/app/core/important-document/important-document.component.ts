import {AfterViewInit, Component, ElementRef, OnInit, ViewChild,OnDestroy, Renderer2,} from '@angular/core';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {saveAs} from 'file-saver';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import swal from "sweetalert2";
import {PMHelperService} from "../../../services/PMHelper.service";
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

interface DataObject {
    [key: string]: any
}

@Component({
    selector: 'app-important-document',
    templateUrl: './important-document.component.html',
    styleUrls: ['./important-document.component.scss']
})

export class ImportantDocumentComponent implements OnInit,AfterViewInit{
    url: any;
    public filter: any;
    meta: any;
    pageSizeOptions: number[] = [10,20,30,40,50,100];
    page = 1;
    size: any = 10;
    perPage: any = 10;
    currentPage = 0;
    selectedNewValue: any;
    sortBy: any;
    documentData:any;
    sortKey: any;
    search: any = '';
    documentColumns: string[] = ['action2','documentName', 'document'];
    documentDataSource: any = new MatTableDataSource([]);
    adminRole: string | undefined;
    @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort!: MatSort;
    @ViewChild('searchBox') myInputVariable: ElementRef | any
    private subject: Subject<string> = new Subject();

    constructor(
        private apiService: PMApiServicesService,
        public dialog: MatDialog,
        private modle: NgbModal,
        private router: Router, private helper : PMHelperService,
        @Inject(DOCUMENT)  private doc: Document) {

        const loggedInUser =  localStorage.getItem('loggedInUser')
        if (loggedInUser != null) {
            const Json = JSON.parse(loggedInUser)
            this.adminRole = Json.roleKey
        }

}

    ngOnInit(): void {
        this.helper.removeIsClicked()
        var data: DataObject = {};
        this.getDocumentList(data);
        this.doc.body.classList.add('custom-modal-width');
    }

    ngAfterViewInit() {
        this.helper.removeIsClicked()
        this.documentDataSource.paginator = this.paginator;
        this.documentDataSource.sort = this.sort;
    }

    ngOnDestroy(): void {
    }

    // Get Document
    getDocumentList = (data: any) => {
        data.page = this.currentPage;
        data.limit = this.perPage;
        if (this.sortBy && this.sortKey) {
            data.sortBy = this.sortBy;
            data.sortKey = this.sortKey;
        }
        if (this.search) {
            data.search = this.search;
        }
        if(this.adminRole === 'SALESMANAGERS' || this.adminRole === 'BUSINESSDEVELOPMENTMANAGER' || this.adminRole === 'BUSINESSDEVELOPMENTEXECUTIVE' || this.adminRole === 'PROJECTMANAGERS'|| this.adminRole === 'NETWORKENGINEER'|| this.adminRole === 'TEAMLEADERS'|| this.adminRole === 'TEAMMEMBERS'){
            this.helper.toggleLoaderVisibility(true)
            this.apiService.documentListing(data).subscribe((data: any) => {
                this.documentData = data.data;
                this.documentDataSource = new MatTableDataSource<any>(this.documentData)
                if(this.documentData.length === 0 && this.currentPage > 1){
                    this.paginator?.previousPage()
                }
                this.meta = data.meta.totalCount;
                this.helper.toggleLoaderVisibility(false)
            });
        }else if(this.adminRole === 'SUPERADMINS'){
            this.helper.toggleLoaderVisibility(true)
            this.apiService.documentListingHrAd(data).subscribe((data: any) => {
                this.documentDataSource = data.data;
                this.documentDataSource = new MatTableDataSource<any>(this.documentDataSource)
                this.meta = data.meta.totalCount;
                this.helper.toggleLoaderVisibility(false)
            });
        }

    }

    // Filter for Search
    applyFilter(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space'){
            event.preventDefault();
        } else {
            this.paginator.firstPage();
            const filterValue = (event.target as HTMLInputElement).value;
            this.search = filterValue.trim().toLowerCase();
            this.getDocumentList({});
        }
    }

    // }
    resetSearch = () => {
        this.paginator.firstPage();
        this.search = '';
        this.getDocumentList({});
    }

    // Download doc
    documentDownload(document: any, fileName: any) {
        if (document && fileName) {
            const pdfLink = document;
            const filename = fileName;
            saveAs(pdfLink, filename);
            swal.fire('', 'File downloaded successfully', 'success');
        } else {
            swal.fire('', 'Something went wrong', 'error');
        }
    }

    // Pagination
    pageChange = (obj: any) => {
        this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
        this.perPage = obj.pageSize;
        this.getDocumentList({});
    }

    // Sort Column function
    sortData(sort: Sort): void {
        const data: DataObject = {};
        if (sort.active && sort.direction) {
            this.sortBy = sort.direction === 'asc' ? 1 : -1;
            'documentName' === sort.active ? this.sortKey = 'documentName' : '';
            'document' === sort.active ? this.sortKey = 'document' : '';
            data.sortKey = this.sortKey;
            data.sortBy = this.sortBy;
        }
        this.getDocumentList({});
    }

    // Open modal
    open(content: any, document: any) {
        if (document && content) {
            this.modle.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any) => {
                if (result) {
                }
                // this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
    }

    space(event:any) {
        if (event.target.selectionStart === 0 && event.code === 'Space'){
            event.preventDefault();
        }
    }

}
