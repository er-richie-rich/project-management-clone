import {Component, OnInit, ViewChild} from '@angular/core';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {saveAs} from 'file-saver';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SafeResourceUrl,DomSanitizer} from "@angular/platform-browser";
import {PMHelperService} from "../../../../../services/PMHelper.service";
import {CancelDeletePopupComponent} from "../../../../popup/cancel-delete-popup/cancel-delete-popup.component";

@Component({
    selector: 'app-files-manage',
    templateUrl: './files-manage.component.html',
    styleUrls: ['./files-manage.component.scss']
})
export class FilesManageComponent implements OnInit {
    projectId: string | null = "0";
    filesColumns: string[] = ['action2', 'fileName', 'fileSize', 'createdAt'];
    filesSource: any = new MatTableDataSource([]);
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort: MatSort | undefined;
    pageSizeOptions: number[] = [10, 20, 30, 40, 50, 100];
    page = 0;
    size: any = 10;
    perPage: any = 10;
    currentPage = 0;
    meta: number = 0
    prFileName: string = ""
    image: any = ''
    extension: string = ''
    fileUrl:any;
    public urlSafe! : SafeResourceUrl
    constructor(private router: Router,
                private apiService: PMApiServicesService,
                public route: ActivatedRoute,
                public dialog: MatDialog,
                private modle: NgbModal,
                public sanitizer: DomSanitizer,
                public helper :PMHelperService
    ) {
        this.projectId = this.route.snapshot.paramMap.get('id') || null;
    }

    ngOnInit(): void {
        this.helper.removeIsClicked()
        this.listOfFiles({});
    }

    listOfFiles(req: any) {
        let perPage = localStorage.getItem('perPageIndex')
        if (perPage) {
            this.perPage = perPage;
        }
        req.projectId = this.projectId;
        if (this.currentPage) {
            req.page = this.currentPage;
        }
        if (this.perPage) {
            req.limit = this.perPage;
        }
        this.apiService.listFile(req).subscribe((data: any) => {
            if (data.meta.status === 1) {
                let fileList = data.data
                this.filesSource = new MatTableDataSource(fileList);
                let isClicked = localStorage.getItem('isClicked');
                if (isClicked) {
                    this.goToPage()
                }
                localStorage.removeItem('isClicked')
                localStorage.removeItem('pageIndex')
                localStorage.removeItem('perPageIndex')
                if (fileList.length === 0 && this.currentPage > 0) {
                    this.paginator?.previousPage()
                }
                this.meta = data.meta.totalCount
            }
        })

}
  goToPage() {
    let pageNumber = localStorage.getItem('pageIndex')
    if(pageNumber){
      this.paginator.pageIndex = +pageNumber;
      this.paginator.page.next({
        pageIndex: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
        length: this.paginator.length
      });
    }
  }

// navigate to edit with id
    editFile(id: string) {
        localStorage.setItem('pageIndex', JSON.stringify(this.paginator.pageIndex))
        localStorage.setItem('perPageIndex', this.perPage)
        this.router.navigate([`/project-management/project-details/add-file/${this.projectId}/${id}`]);
    }

// Open modal
    open(content: any, document: any) {
        const exc = document.lastIndexOf('.')
        this.extension = document.substring(exc).toLowerCase();
        var parts = document.split("/");
        this.prFileName = parts[parts.length - 1];
        if (this.extension === '.pdf'|| this.extension === '.png'||this.extension === '.jpg'||this.extension === '.jpeg'||this.extension === '.svg') {
            if (document && content) {
                this.modle.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any) => {
                    // this.closeResult = `Closed with: ${result}`;
                }, (reason) => {
                    // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                });
            }
        } else{
            if(this.extension==='.csv' ){
                let blob = new Blob([document.file], { type: 'text/csv' });
                saveAs(blob);
            }else{
                const Link = document;
                const filename = this.prFileName;
                saveAs(Link, filename);
            }
        }

    }

    cleanUrl(url:any){
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    documentDownload(fileLink: any, fileName: any) {
        const pdfLink = fileLink;
        const filename = fileName;
        saveAs(pdfLink, filename);
        swal.fire(
            '',
            'pdf download successfully!',
            'success'
        );
    }

// delete file
    deleteFile(id: any, index: number, event: any): any {
        const dialogRef = this.dialog.open(CancelDeletePopupComponent, {
            width: "500px",
            data: {message: 'Are you sure you want to delete this project file?',key:"Delete Project File",icon:"delete-icon.png"}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.apiService.deleteFile(id).subscribe((data: any) => {
                    let metaData: any = data.meta.message;
                    this.filesSource.data.splice(index, 1);
                    this.filesSource = new MatTableDataSource(this.filesSource.data);
                    swal.fire(
                        'Deleted!',
                        metaData,
                        'success'
                    );
                    this.listOfFiles({});
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
        this.listOfFiles({});
    }

}

