import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {SelectionModel} from '@angular/cdk/collections';
import {HttpClient} from "@angular/common/http";
import {saveAs} from "file-saver";
import {PMHelperService} from "../../../services/PMHelper.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import {CancelDeletePopupComponent} from "../../popup/cancel-delete-popup/cancel-delete-popup.component";

export interface documents {

  dd: any
  documentId: any
  documentName: any
  isVisible: boolean;
  status: any;
}

interface DataObject {
  [key: string]: any
}

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.scss']
})
export class DocumentManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild('clearString') clearString!: ElementRef;
  @ViewChild('hotLeads') hotLeads!: ElementRef;
  pageSizeOptions: number[] = [10, 20, 30, 40, 50, 100];
  page = 1;
  size: any = 10;
  perPage: any = 10;
  currentPage = 0;
  requestBody: any = {};
  sortBy: any = -1;
  sortKey: any;
  documents: any;
  search: any;
  adminRole: string = '';
  dataSource: any = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  toppings = new FormControl('');
  isVisible: boolean = false
  meta: any;
  selectedDocumentId: any;
  headers: string[] = ['Action','name', 'fileName'];
  columns: string[] = ['action','documentName', 'document'];
  // displayedColumns: string[] = ['action2','name', 'fileName', 'status',];
  selection = new SelectionModel<documents>(true, []);

  constructor(
    public dialog: MatDialog,
    private modle: NgbModal,
    private apiService: PMApiServicesService,
    private router: Router,
    private renderer: Renderer2,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private helper: PMHelperService,
    @Inject(DOCUMENT) private doc: Document,
  ) {
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
  }

  // Open modal
  open(event:any) {
    if (event.element.documentName && event.content ) {
      this.modle.open(event.content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any) => {
        // this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected = () => {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.selectedDocumentId = this.dataSource.data.filter((e: documents) => this.selection.isSelected(e)).map((e: { documentId: any; }) => e.documentId);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle = ($event: any) => {
    // console.log($event)
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: documents) => this.selection.select(row));
  }

  test(url: any) {
    var n = url.split('/');
    return n[n.length - 1];
  }

  pageChange = (obj: any) => {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.getDocumentList({});
  }

  /* Delete Document*/
  deleteDocument = (documentId: any) => {
    this.selectedDocumentId = documentId;
    this.searchString.nativeElement.value = '';
    const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Document?',key:"Delete Document",icon:"delete-icon.png"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deletedocument(this.selectedDocumentId).subscribe(
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
                this.getDocumentList({})
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


  /*Edit Document*/
  editDocument = (documentId: any) => {
    localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
    localStorage.setItem('perPage', this.perPage)
    this.router.navigate([`/document-management/add-edit-document/` + documentId]).then();
  }
  /*Get Document*/
  getDocumentList = (data: any) => {
    let perPage = localStorage.getItem('perPage')
    if(perPage){
      this.perPage = perPage;
    }
    data.page = this.currentPage;
    data.limit = this.perPage;
    if (this.sortBy && this.sortKey) {
      data.sortBy = this.sortBy;
      data.sortKey = this.sortKey;
    }
    if (this.search) {
      data.search = this.search;
    }
    this.helper.toggleLoaderVisibility(true)
    if(this.adminRole === 'SALESMANAGERS' || this.adminRole === 'BUSINESSDEVELOPMENTMANAGER' || this.adminRole === 'BUSINESSDEVELOPMENTEXECUTIVE' || this.adminRole === 'PROJECTMANAGERS'|| this.adminRole === 'NETWORKENGINEER'|| this.adminRole === 'TEAMLEADERS'|| this.adminRole === 'TEAMMEMBERS'){
      this.helper.toggleLoaderVisibility(true)
      this.apiService.documentListing(data).subscribe((data: any) => {
        this.documents = data.data;
        this.dataSource = new MatTableDataSource<any>(this.documents)
        let isClicked = localStorage.getItem('isClicked');
        if(isClicked){
          this.goToPage()
        }
        localStorage.removeItem('isClicked')
        localStorage.removeItem('page')
        localStorage.removeItem('perPage')
        if(this.documents.length === 0 && this.currentPage > 1){
          this.paginator?.previousPage()
        }
        this.meta = data.meta.totalCount;
        this.helper.toggleLoaderVisibility(false)
      });
    } else {
      this.apiService.documentListingHrAd(data).subscribe((data: any) => {
        if (data && data?.meta && data.meta.status == 1) {
          this.documents = data.data
          this.dataSource = new MatTableDataSource<documents>(this.documents)
          let isClicked = localStorage.getItem('isClicked');
          if (isClicked) {
            this.goToPage()
          }
          localStorage.removeItem('isClicked')
          localStorage.removeItem('page')
          localStorage.removeItem('perPage')
          if (this.documents.length === 0 && this.currentPage > 0) {
            this.paginator?.previousPage()
          }
          this.meta = data.meta.totalCount;
          this.helper.toggleLoaderVisibility(false)
        }
      })
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

  // download document
  documentDownload(document: any) {
    const pdfLink = document.document;
    const filename = document.fileName;
    saveAs(pdfLink, filename);
    swal.fire(
      '',
      'document downloaded successfully!',
      'success'
    );
  }
  /*Filter for Search*/
  applyFilter(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    } else {
      this.paginator.firstPage();
      const filterValue = (event.target as HTMLInputElement).value;
      this.search = filterValue.trim().toLowerCase();
      this.isVisible = this.search !== '';
      this.getDocumentList({});
    }
  }

  clearSearch = (event: any) => {
    this.paginator.firstPage();
    this.searchString.nativeElement.value = '';
    if (this.searchString.nativeElement.value === '') {
      this.isVisible = false;
      this.search = '';
    }
    this.getDocumentList({});
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

  sortData(sortKey: any, sortBy: any) {
    this.sortBy = (sortBy === -1) ? 1 : -1;
    this.sortKey = sortKey;
    this.getDocumentList({});
  }
}
