/*import { Component, OnInit } from '@angular/core';
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

interface DataObject {
  [key: string]: any;
}

@Component({
  selector: 'app-add-edit-inventory',
  templateUrl: './add-edit-inventory.component.html',
  styleUrls: ['./add-edit-inventory.component.scss']
})
export class AddEditInventoryComponent implements OnInit {
  inventoryForm: any = FormGroup;
  userList:any;
  SelectedEmployee:any;
  storageDisk:any;
  SystemType: any = [
    {value: 'Desktop'},
    {value: 'Laptop'},
  ];
  pc: any = [
    {value: 'All in one'},
    {value: 'CPU'},
  ];
  keyboardAndMouse: any = [
    {value: 'Wireless'},
    {value: 'Wired'},
  ];
  lcdAndLed: any = [
    {value: '18 inch'},
    {value: '21 inch'},
    {value: '24 inch'},
  ];
  os: any = [
    {value: 'Ubuntu'},
    {value: 'Mac'},
    {value: 'Windows'},
  ];
  StorageDetails: any = [
    {value: 'HDD'},
    {value: 'SSD'},
    {value: 'Both'},
  ];

  constructor(private apiService: PMApiServicesService,public _formBuilder: FormBuilder,) {
    this.inventoryForm = this._formBuilder.group({
      userId: ['', Validators.required],
      employeeName: ['', Validators.required],
      department:[],
      systemType:['', Validators.required],
      pc:[''],
      ram:['', Validators.required],
      storageType:['', Validators.required],
      ssdSize:['',Validators.required],
      hddSize:['',Validators.required],
      keyboardAndMouse:['', Validators.required],
      lcdAndLed:['', Validators.required],
      os:['', Validators.required],
      headphone:[false,Validators.required]
    });
  }

  ngOnInit(): void {
    const reqBody: DataObject = {};
    reqBody.limit = 1000;
    this.apiService.listUser(reqBody).subscribe(data => {
      this.userList = data.data
    })
  }

  getEmpNameAndDepartment(code:any){
    this.SelectedEmployee = this.userList.find((ar:any) => ar.userId === code);
    this.inventoryForm.patchValue({
      employeeName: this.SelectedEmployee.fullName,
    })
    this.inventoryForm.controls['employeeName'].disable();
  }
  // getPcDetails(system:any){
  // }
  getStorageSize(diskVal:any){
    this.storageDisk = diskVal
  }
  check(e:any){
    this.inventoryForm.patchValue({
      headphone: e.checked
    })
  }
  AddInventory(){
    if (this.storageDisk === 'HDD'){
      this.inventoryForm.get('ssdSize').setErrors(null);
    } else if (this.storageDisk === 'SDD'){
      this.inventoryForm.get('hddSize').setErrors(null);
    }
    if (this.inventoryForm.valid){
      console.log("valid",this.inventoryForm.valid)
    } else {
      console.log("invalid",this.inventoryForm.valid)
    }
 }
}*/

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import swal from 'sweetalert2';
import {PMHelperService,noWhitespaceValidation} from "../../../../services/PMHelper.service";
interface DataObject {
  [key: string]: any;
}
@Component({
  selector: 'app-add-edit-inventory',
  templateUrl: './add-edit-inventory.component.html',
  styleUrls: ['./add-edit-inventory.component.scss']
})
export class AddEditInventoryComponent implements OnInit {
  editMode: string = "Add";
  inventoryForm: any = FormGroup;
  userId : any;
  SelectedEmployee:any;
  userList:any;
  inventoryData:any;
  storageDisk:any;
  SystemType: any = [
    {value: 'Desktop'},
    {value: 'Laptop'},
  ];
  pc: any = [
    {value: 'All in one'},
    {value: 'CPU'},
  ];
  keyboardAndMouse: any = [
    {value: 'Wireless'},
    {value: 'Wired'},
  ];
  lcdAndLed: any = [
    {value: '18 inch'},
    {value: '21 inch'},
    {value: '24 inch'},
  ];
  os: any = [
    {value: 'Ubuntu'},
    {value: 'Mac'},
    {value: 'Windows'},
  ];
  StorageDetails: any = [
    {value: 'HDD'},
    {value: 'SSD'},
    {value: 'Both'},
  ];
  
  constructor(
      private _formBuilder: FormBuilder,
      private apiService: PMApiServicesService,
      public route: ActivatedRoute,
      private router: Router,
      public helper:PMHelperService,
  ) {
    const data: DataObject = {};
    data.limit = 1000;
    this.apiService.listUser(data).subscribe(data => {
      this.userList = data.data
    })
  
    this.inventoryForm = this._formBuilder.group({
      inventoryId:[],
      userId: ['', [Validators.required]],
      employeeName: ['', Validators.required],
      department:['', Validators.required],
      systemType:['', Validators.required],
      pc:['', Validators.required],
      ram:['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
      storageType:['', Validators.required],
      ssdSize:['',[Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
      hddSize:['',[Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
      keyboardAndMouse:['', Validators.required],
      lcdAndLed:['', Validators.required],
      os:['', Validators.required],
      headphone:[false,Validators.required]
    });
    this.inventoryForm.controls['employeeName'].disable();
    this.inventoryForm.controls['department'].disable();

    const id: any = this.route.snapshot.paramMap.get('id');
    if (id != "0") {
      this.editMode = "Edit";
      this.apiService.getInventory(id).subscribe((data: any) => {
        if (data && data?.meta && data.meta.status == 1) {
          let inventoryData = data.data;
          this.userId = inventoryData.userId;
          this.storageDisk = inventoryData.storageType;
          this.inventoryForm.patchValue({
            inventoryId:inventoryData.inventoryId,
            userId: inventoryData.userId,
            employeeName: inventoryData.empName,
            department:inventoryData.departmentName,
            systemType:inventoryData.systemType,
            pc:inventoryData.pc,
            ram:inventoryData.ram,
            storageType:inventoryData.storageType,
            ssdSize:inventoryData.ssdSize,
            hddSize:inventoryData.hddSize,
            keyboardAndMouse:inventoryData.keyboardAndMouse,
            lcdAndLed:inventoryData.lcdAndLed,
            os:inventoryData.os,
            headphone:inventoryData.headphone
          });
        }
      }, err => {
        swal.fire('Error!', err.error.message, 'info').then();
      });
    }
  }
  
  ngOnInit(): void {
  }
  getEmpNameAndDepartment(code:any){
    this.SelectedEmployee = this.userList.find((ar:any) => ar.userId === code);
    this.inventoryForm.patchValue({
      employeeName: this.SelectedEmployee.fullName,
      department:this.SelectedEmployee.departmentName
    })
  }
  getStorageSize(diskVal:any){
    this.storageDisk = diskVal
  }
  check(e:any){
    this.inventoryForm.patchValue({
      headphone: e.checked
    })
  }
  AddInventory(){
    if (this.storageDisk === 'HDD'){
      this.inventoryForm.patchValue({
        ssdSize:''
      })
      this.inventoryForm.get('ssdSize').setErrors(null);
    } else if (this.storageDisk === 'SSD'){
      this.inventoryForm.patchValue({
        hddSize:''
      })
      this.inventoryForm.get('hddSize').setErrors(null);
    }
    if(this.inventoryForm.value.systemType === 'Laptop'){
      this.inventoryForm.patchValue({
        pc:''
      })
      this.inventoryForm.get('pc').setErrors(null);
    }
    if (this.inventoryForm.valid){
      this.apiService.addEditInventory(this.inventoryForm.value).subscribe((data:any)=>{
        if (data.meta.status === 0){
          swal.fire('Error!', data.meta.message, 'info');
        } else {
          this.setIsClicked()
          this.router.navigate(['/inventory-management']);
          swal.fire('', data.meta.message, 'success');
        }
      }, (err) => {
        const e = err.error;
        if (e.statusCode !== 401) {
          swal.fire(
              'Error!',
              err.error.message,
              'info'
          );
        }
      });
    } else {
      console.log("invalid",this.inventoryForm.valid)
    }
  }

  backToInventoryList(){
    this.setIsClicked()
    this.router.navigate(['/inventory-management/']).then();
  }

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }

  checkNumber(e:ClipboardEvent){
    let data = e.clipboardData
    let pasteData = data?.getData('text')
    if (pasteData?.includes('.')){
      e.preventDefault();
    }
  }
}
