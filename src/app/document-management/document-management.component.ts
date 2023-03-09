//
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { PMApiServicesService } from 'src/services/PMApiServices.service';
// import { PopupConfirmDeleteComponent } from '../popup/popup-confirm-delete/popup-confirm-delete.component';
// import { MatDialog } from '@angular/material/dialog';
// import swal from 'sweetalert2';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatTableDataSource } from '@angular/material/table';
// import { Router } from '@angular/router';
// import { saveAs } from 'file-saver';
// import { debounceTime } from 'rxjs/operators';
// import { Subject } from 'rxjs';
//
// export interface documents {
//   document: any
//   documentId: any
//   documentName: any
//   isVisible: true
//   status: any
//
//   /*categoryId: any;
//   categoryName: string;
//   categoryImage: string;
//   status: any;
//   categoryDescription: any;
//   productCount: any;
//   subCategoryCount: any;
//   action2: string;
//   selectall: any;*/
// }
// interface DataObject {
//   [key: string]: any
// }
// @Component({
//   selector: 'app-document-management',
//   templateUrl: './document-management.component.html',
//   styleUrls: ['./document-management.component.scss']
// })
// export class DocumentManagementComponent implements OnInit {
//   loadData: any = true;
//   throttle = 300;
//   scrollDistance = 1;
//   scrollUpDistance = 0;
//   direction = '';
//   public filter: any;
//   public requestPara = {};
//   public current_page = 1;
//   public limit = 25;
//   employeeName: any = [];
//   url: any;
//   documentColumns: string[] = ['name', 'fileName', 'status', 'action'];
//   documentDataSource: any = new MatTableDataSource([]);
//   @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
//   @ViewChild(MatSort) sort: MatSort | undefined;
//   private subject: Subject<string> = new Subject();
//   constructor(private apiService: PMApiServicesService
//     , public dialog: MatDialog,
//     private router: Router,) { }
//
//
//
//   // for serching
//   onKeyUp(event: any) {
//     this.current_page = 1;
//     this.subject.next(event.target.value);
//   }
//   ngOnInit(): void {
//      this.getDocumentList({ page: 1,limit:25});
//     this.subject.pipe(debounceTime(500)).subscribe(searchTextValue => {
//       this.applyFilter(searchTextValue)
//     });
//   }
//   applyFilter(filterValue: string) {
//     if (filterValue) {
//       filterValue = filterValue.trim();
//       filterValue = filterValue.toLowerCase()
//     }
//     this.filter = filterValue;
//     this.documentDataSource.data = [];
//     this.requestPara = {
//       searchKey: filterValue,
//       limit: this.limit,
//       page: this.current_page,
//     };
//     this.getDocumentList(this.requestPara);
//   }
//   ngOnDestroy(): void { }
//
//   test(url:any) {
//     var n = url.split('/');
//
//     return n[n.length - 1];
//   }
//   getDocumentList(req: any): any {
//     if(this.loadData){
//     this.apiService.documentListing(req).subscribe((data: any) => {
//       //this.documentDataSource = data.data;
//       let listData=data.data;
//       console.log(listData)
//       this.loadData = (listData.length > 0);
//       this.documentDataSource.data = data.data
//       /*listData.forEach((element: any) => {
//         this.documentDataSource.data.push(element);
//       });*/
//       this.documentDataSource = new MatTableDataSource(this.documentDataSource.data);
//       this.documentDataSource.paginator = this.paginator;
//     });
//     }
//   }
//
//   editDocument(id: string) {
//
//     this.router.navigate([`/add-edit-document-management/document-management/` + id]);
//   }
//   deleteDocument(id: any, index: number, event: any): any {
//
//     const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
//       width: "500px",
//       data: { message: 'Are you sure you want to delete this Documenet?' }
//     });
//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.apiService.deletedocument(id).subscribe(data => {
//           let metaData: any = data.meta.message;
//           this.getDocumentList({})
//           swal.fire(
//             'Deleted!',
//             metaData,
//             'success'
//           );
//         }, (err: any) => {
//
//           const e = err.error;
//           swal.fire(
//             'Error!',
//             err.error.message,
//             'info'
//           );
//
//         });
//       }
//     });
//   }
//   // infinite scrolling
//   public onScrollDown(): void {
//     this.current_page +=  1;
//     this.direction='down';
//     this.requestPara = {
//       page: this.current_page,
//       limit:this.limit
//   };
//     this.getDocumentList(this.requestPara);
//   }
//
//
//
// //   // download document
//   documentDownload(document: any, fileName: any) {
//     const pdfLink = document;
//     const filename = fileName;
//     saveAs(pdfLink, filename);
//     // swal.fire(
//     //   '',
//     //   'pdf download successfully!',
//     //   'success'
//     // );
// }

// }


import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PopupConfirmDeleteComponent} from "../popup/popup-confirm-delete/popup-confirm-delete.component";
import {MatDialog} from "@angular/material/dialog";
import {PMApiServicesService} from "../../services/PMApiServices.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {SelectionModel} from '@angular/cdk/collections';
import {HttpClient} from "@angular/common/http";
import {saveAs} from "file-saver";
import {getLocaleFirstDayOfWeek} from "@angular/common";
import * as FileSaver from "file-saver";
import {PMHelperService} from "../../services/PMHelper.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

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
  dataSource: any = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  toppings = new FormControl('');
  isVisible: boolean = false
  meta: any;
  selectedDocumentId: any;
  displayedColumns: string[] = ['action2','name', 'fileName', 'status',];
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
  open(content: any, document: any) {
    if (document && content) {
      this.modle.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any) => {
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
    const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Document?'}
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
    // if (this.currentPage) {
    //   data.page = this.currentPage;
    // }
    // if (this.perPage) {
    //   data.limit = this.perPage;
    // }
    if (this.search) {
      data.search = this.search;
    }
    this.helper.toggleLoaderVisibility(true)
    this.apiService.documentListingHrAd(data).subscribe((data: any) => {
      if (data && data?.meta && data.meta.status == 1) {
        this.documents = data.data
        this.dataSource = new MatTableDataSource<documents>(this.documents)
        let isClicked = localStorage.getItem('isClicked');
        if(isClicked){
          this.goToPage()
        }
        localStorage.removeItem('isClicked')
        localStorage.removeItem('page')
        localStorage.removeItem('perPage')
        if(this.documents.length === 0 && this.currentPage > 0){
          this.paginator?.previousPage()
        }
        this.meta = data.meta.totalCount;
        this.helper.toggleLoaderVisibility(false)
      }
    })
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
  documentDownload(document: any, fileName: any) {
    const pdfLink = document;
    const filename = fileName;
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

  /*Filter for Search*/
  // applyFilter(event: any) {
  //   this.isVisible = true;
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.search = filterValue.trim().toLowerCase();
  //   // this.currentPage = 0;
  //
  //   if(this.search){
  //     this.currentPage = 1;
  //     this.ngAfterViewInit();
  //   } else {
  //     if (this.searchString.nativeElement.value === '') {
  //       this.isVisible = false;
  //     }
  //   }
  //   this.getDocumentList({});
  // }
  //
  // clearSearch = (event: any) => {
  //   this.isVisible = true;
  //   this.search = '';
  //   this.searchString.nativeElement.value = '';
  //   if (this.searchString.nativeElement.value === '') {
  //     this.isVisible = false;
  //   }
  //   this.getDocumentList({});
  // }

  sortData(sortKey: any, sortBy: any) {
    this.sortBy = (sortBy === -1) ? 1 : -1;
    this.sortKey = sortKey;
    this.getDocumentList({});
  }
}
