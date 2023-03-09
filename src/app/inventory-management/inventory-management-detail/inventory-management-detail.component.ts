import { Component, OnInit } from '@angular/core';
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PopupConfirmDeleteComponent} from "../../popup/popup-confirm-delete/popup-confirm-delete.component";
import {MatTableDataSource} from "@angular/material/table";
import swal from "sweetalert2";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-inventory-management-detail',
  templateUrl: './inventory-management-detail.component.html',
  styleUrls: ['./inventory-management-detail.component.scss']
})
export class InventoryManagementDetailComponent implements OnInit {
  inventoryData:any = {};
  _inventoryId:any;

  constructor(private apiService: PMApiServicesService,
              public route: ActivatedRoute,
              public dialog: MatDialog,
              private router: Router,) { }

  ngOnInit(): void {
  const id: any = this.route.snapshot.paramMap.get('id');
   this._inventoryId = id
  this.apiService.getInventory(id).subscribe((data: any) => {
    if(data.meta.status === 1){
      this.inventoryData = data.data;
    }
  });
  }

  deleteInventory(){
    const dialogRef = this.dialog.open(PopupConfirmDeleteComponent, {
      width: "500px",
      data: {message: 'Are you sure you want to delete this Inventory?'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteInventory(this._inventoryId).subscribe(
            data => {
              swal.fire(
                  'Deleted!',
                  data.meta.message,
                  'success'
              ).then(()=>{
                this.setIsClicked()
                this.router.navigate(['/inventory-management']);
              });
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
    })
  }

  backToInventoryList(){
    this.setIsClicked()
    this.router.navigate(['/inventory-management/']).then();
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }
}
