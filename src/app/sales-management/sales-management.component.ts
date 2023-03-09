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
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {FormControl} from "@angular/forms";
import {SelectionModel} from '@angular/cdk/collections';
import {filter} from 'rxjs/operators';
import {saveAs} from 'file-saver';
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import Swal from "sweetalert2";
import {PopupImportLeadsComponent} from "../popup/popup-import-leads/popup-import-leads.component";
import {PMHelperService} from "../../services/PMHelper.service";

export interface salesLead {
  leadId: any;
  createdAt: Date;
  leadGenerationDate: Date;
  leadGeneratedBy: string;
  leadType: string;
  salesPerson: string;
  status: any;
  detail: any;
  action2: string;
  selectall: any;
}

interface DataObject {
  [key: string]: any
}

@Component({
  selector: 'app-sales-management',
  templateUrl: './sales-management.component.html',
  styleUrls: ['./sales-management.component.scss'],
})
export class SalesManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchString') searchString!: ElementRef;
  @ViewChild('clearString') clearString!: ElementRef;
  @ViewChild('hotLeads') hotLeads!: ElementRef;
  pageSizeOptions: number[] = [10,20,30,40,50,100];
  page = 1;
  size: any = 10;
  perPage: any = 10;
  currentPage = 1;
  selectedValue: any = 'all';
  selectedNewValue: any;
  requestBody: any = {};
  sortBy: any;
  sortKey: any;
  salesLeads: any;
  search: any;
  dataSource: any = new MatTableDataSource([]);
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  toppings = new FormControl('');
  toppingList: any[] =
    [
      {name: 'All', value: 'all'},
      {name: 'Open', value: 'open'},
      {name: 'On Hold', value: 'on hold'},
      {name: 'Scope Sent', value: 'scope sent'},
      {name: 'Proposal Sent', value: 'proposal sent'},
      {name: 'Invoice Sent', value: 'invoice sent'},
      {name: 'Won', value: 'won'},
      {name: 'Lost', value: 'lost'}
    ]
  isVisible: boolean = false;
  isDisabled: boolean = true;
  leadTitle: any;
  clientName: any;
  email: any;
  selectedHotLead: any = false;
  lead_type: any;
  meta: any;
  activeSort: any;
  directionSort: any;
  selectedLeadId: any;
  url: any;
  displayedColumns: string[] = ['selectall', 'action2', 'leadTitle', 'clientName', 'email', 'createdAt', 'leadGenerationDate', 'leadType', 'leadGeneratedBy', 'isHotLead', 'leadStatus'];
  //////////////////////////////////////////////////////////////////
  selection = new SelectionModel<salesLead>(true, []);

  constructor(
    public dialog: MatDialog,
    private apiService: PMApiServicesService,
    private router: Router,
    private renderer: Renderer2,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private helper : PMHelperService
  ) {
    this.lead_type = this.activatedRoute.snapshot.queryParamMap.get("lead");
    if (this.lead_type === 'open') {
      this.selectedValue = 'open';
    } else if (this.lead_type === 'lost') {
      this.selectedValue = 'lost';
    } else if (this.lead_type === 'all') {
      this.selectedValue = 'all';
    } else if (this.lead_type === 'won') {
      this.selectedValue = 'won';
    } else if (this.lead_type === 'on-hold') {
      this.selectedValue = 'on hold';
    } else if (this.lead_type === 'scope-sent') {
      this.selectedValue = 'scope sent';
    } else if (this.lead_type === 'proposal-sent') {
      this.selectedValue = 'proposal sent';
    }else if (this.lead_type ==="invoice-sent"){
      this.selectedValue = 'invoice sent';
    } else if (this.lead_type === 'hot-lead') {
      this.selectedHotLead = true;
    }
    // this.getSalesLeads()
  }

  ngOnInit(): void {
    this.helper.removeIsClicked()
    var data: DataObject = {};
    if (this.selectedValue) {
      data.leadStatus = this.selectedValue;
    }
    if (this.selectedHotLead) {
      data.isHotLead = true;
    }
    this.getSalesLeads(data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected = () => {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.selectedLeadId = this.dataSource.data.filter((e: salesLead) => this.selection.isSelected(e)).map((e: { leadId: any; }) => e.leadId);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  /*masterToggle = ($event: any) => {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: salesLead) => this.selection.select(row));
  }*/
  masterToggle = ($event: any) => {
    if($event.checked){
      this.dataSource.data.forEach((row: salesLead) => this.selection.select(row));
    } else {
      this.selection.clear()
      this.selectedLeadId = null
    }
  }

  deleteRow = () => {
    if (this.selectedLeadId === null) {
      swal.fire(
        '',
        "Please select at least one row to delete",
        'info'
      ).then();
    } else {
      const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
        width: "500px",
        data: {message: 'Are you sure you want to delete this Lead?'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.apiService.salesDeleteRows({leadId: this.selectedLeadId}).subscribe(
            data => {
              if (data && data?.meta) {
                if (data.meta.status == 1) {
                  this.dataSource = new MatTableDataSource(this.dataSource.data);
                  let metaData: any = data.meta.message;
                  this.selection.clear();
                  swal.fire(
                    'Deleted!',
                    metaData,
                    'success'
                  ).then(() => {
                    // window.location.reload();
                  });
                  this.selection.clear();
                  this.getSalesLeads({})
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
    this.apiService.exportAllLeads({leadId: this.selectedLeadId}).subscribe(
      data => {
        if (data && data?.meta) {
          if (data.meta.status == 1) {
            this.url = data.data.url;
            const date = new DatePipe('en-US').transform(new Date(), 'ddMMyy');
            const filename = 'leads_' + date + '.xlsx';
            saveAs.saveAs(this.url, filename);
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            swal.fire(
              'Exported!',
              data.meta.message,
              'success'
            ).then(()=>{
              this.selectedLeadId = null;
            });
            this.getSalesLeads({})
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
  pageChange = (obj: any) => {
    this.currentPage = (this.paginator?.pageIndex ?? 0) + 1;
    this.perPage = obj.pageSize;
    this.selection.clear()
    this.selectedLeadId = null
    this.getSalesLeads({ page: this.currentPage});
  }

  // Delete Leads
  deleteLeads = (leadId: any) => {
    this.searchString.nativeElement.value = '';
    this.getSalesLeads({});
    const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Lead?'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteSalesLeads({leadId: leadId}).subscribe(
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
                this.getSalesLeads({})
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

  changeHotLeadStatus(leadId: any, $event: MatSlideToggleChange) {
    this.apiService.salesHotLeadStatusUpdate({leadId: leadId, isHotLead: $event.checked}).subscribe(
      data => {
        if (data && data?.meta) {
          if (data.meta.status == 1) {
            swal.fire(
              '',
              data.meta.message,
              'success'
            );
            this.getSalesLeads({});
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
      }
    )
  }
  setLocalStorage(){
    localStorage.setItem('page', JSON.stringify(this.paginator.pageIndex))
    localStorage.setItem('perPage', this.perPage)
  }

  // Edit Leads
  editLeads = (leadId: any) => {
    this.setLocalStorage()
    this.router.navigate(['sales-management/add-new-lead/' + leadId]).then();
  }

  leadsDetail(Id:any){
    this.setLocalStorage()
    this.router.navigate(['sales-management/view-lead/' + Id])
  }
  // Get leads
  getSalesLeads = (data: any) => {
    let perPage = localStorage.getItem('perPage')
    if(perPage){
      this.perPage = perPage;
    }
    data.page = this.currentPage;
    data.limit = this.perPage;
    if (this.selectedValue) {
      data.leadStatus = this.selectedValue;
    }
    if (this.selectedHotLead) {
      data.isHotLead = true;
    }
    if (this.sortBy && this.sortKey) {
      data.sortBy = this.sortBy;
      data.sortKey = this.sortKey;
    }
    // if (this.currentPage) {
    //   data.page = this.currentPage;
    // }
    // if (this.perPage) {
    //   data.limit = this.perPage
    // }
    if (this.search) {
      data.search = this.search;
    }
    // console.log("data >>>", data);
    this.helper.toggleLoaderVisibility(true)
    this.apiService.salesLeads(data).subscribe(data => {
        if (data && data?.meta && data.meta.status == 1) {
          this.salesLeads = data.data
          this.dataSource = new MatTableDataSource<salesLead>(this.salesLeads)
          let isClicked = localStorage.getItem('isClicked');
          if(isClicked){
            this.goToPage()
          }
          localStorage.removeItem('isClicked')
          localStorage.removeItem('page')
          localStorage.removeItem('perPage')
          if(this.salesLeads.length === 0 && this.currentPage > 1){
            this.paginator?.previousPage()
          }
          this.meta = data.meta.totalCount;
          this.meta === 0 ? this.isDisabled = true : this.isDisabled = false ;
          this.helper.toggleLoaderVisibility(false)
        }
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

  filterByLeadStatus = (value: any) => {
    this.selectedValue = value;
    this.getSalesLeads({});
  }
  filterHotLead = (value: any) => {
    // console.log("value >>>", value);
    this.selectedHotLead = value;
    this.getSalesLeads({});
  }

  // Filter for Search
  applyFilter(event: any) {
    this.paginator.firstPage();
    // const filterValue = (event.target as HTMLInputElement).value;
    this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.isVisible = this.search !== '';
    this.getSalesLeads({});
  }

  clearSearch = (event: any) => {
    this.paginator.firstPage();
    this.searchString.nativeElement.value = '';
    if (this.searchString.nativeElement.value === '') {
      this.isVisible = false;
      this.search = '';
    }
    this.getSalesLeads({});
  }


  // applyFilter(event: any) {
  //   this.isVisible = true;
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.search = filterValue.trim().toLowerCase();
  //   // this.currentPage = 1;
  //
  //   if(this.search){
  //     this.currentPage = 1;
  //     this.ngAfterViewInit();
  //   } else {
  //     if (this.searchString.nativeElement.value === '') {
  //       this.isVisible = false;
  //     }
  //   }
  //   this.getSalesLeads({});
  // }
  //
  // clearSearch = (event: any) => {
  //   this.isVisible = true;
  //   this.search = '';
  //   this.searchString.nativeElement.value = '';
  //   if (this.searchString.nativeElement.value === '') {
  //     this.isVisible = false;
  //   }
  //   this.currentPage = 1
  //   this.ngAfterViewInit();
  //   this.getSalesLeads({});
  // }

  // Sort Column function
  sortData(sort: Sort): void {
    var data: DataObject = {};
    if (sort.active && sort.direction) {
      this.sortBy = sort.direction === 'asc' ? 1 : -1;
      'leadTitle' === sort.active ? this.sortKey = 'leadTitle' : '';
      'clientName' === sort.active ? this.sortKey = 'clientName' : '';
      'email' === sort.active ? this.sortKey = 'email' : '';
      'leadGenerationDate' === sort.active ? this.sortKey = 'leadGenerationDate' : '';
      'createdAt' === sort.active ? this.sortKey = 'createdAt' : '';
      'leadBy' === sort.active ? this.sortKey = 'leadBy' : '';
      'leadGeneratedBy' === sort.active ? this.sortKey = 'leadGeneratedBy' : '';
      'isHotLead' === sort.active ? this.sortKey = 'isHotLead' : '';
      'leadStatus' === sort.active ? this.sortKey = 'leadStatus' : '';
      data.sortKey = this.sortKey;
      data.sortBy = this.sortBy;
    }
    this.getSalesLeads({});
  }

  importLeadsData = async () => {
    const dialogRef = this.dialog.open(PopupImportLeadsComponent, {
      width: "600px",
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const formData = new FormData();
        formData.append("leadFile", result)
        this.apiService.importAllLeads(formData).subscribe(
            data => {
              if (data && data?.meta) {
                if (data.meta.status == 1) {
                  this.dataSource = new MatTableDataSource(this.dataSource.data);
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
                  this.getSalesLeads({})
                } else {
                  swal.fire(
                      'Error!',
                      data.meta.message,
                      'error'
                  ).then();
                }
              } else {
                Swal.fire(
                    'Error!',
                    "Kindly choose excel file",
                    'error'
                ).then();
              }
            }
        )
      }
    })
  }

  space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
}
