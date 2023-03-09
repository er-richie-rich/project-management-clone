import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PMApiServicesService} from "../../../services/PMApiServices.service";
import {noWhitespaceValidation, PMHelperService} from "../../../services/PMHelper.service";
import {DomSanitizer} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {Inject} from '@angular/core';
import swal from "sweetalert2";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
@Component({
    selector: 'app-add-edit-ticket',
    templateUrl: './add-edit-ticket.component.html',
    styleUrls: ['./add-edit-ticket.component.scss']
})
export class AddEditTicketComponent implements OnInit {
    title: any = "Add";
    addEditTicketForm: FormGroup
    @ViewChild('myInput') myInputVariable!: ElementRef;
    filePDF: any;
    userId:any;
    fileStatus: boolean = false;
    fileUpload: boolean = false;
    imagePreview: any;
    documentName: any;
    document: any;
    docRefName: any;
    ticketCode:any;
    userName:any;
    urgency:any;
    message:any;
    ticketStatus:any;
    subject:any
    image:any
    constructor(
        private router: Router, private fb: FormBuilder,
        private apiService: PMApiServicesService,
        public route: ActivatedRoute,
        public helper: PMHelperService,
        private sanitizer: DomSanitizer,
        private modle: NgbModal,
        @Inject(DOCUMENT) private doc: Document,
    ) {

       this.userId = localStorage.getItem('loginId')
        const ticketId: any = this.route.snapshot.paramMap.get('id');
        this.addEditTicketForm = this.fb.group({
            userId: [this.userId],
            ticketId:[''],
            urgency: ['', [Validators.required]],
            subject: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
            message: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
        })
        if (ticketId != "0") {
            this.title='Edit';
            this.apiService.getTicket(ticketId).subscribe((data: any) => {
                if (data && data?.meta && data.meta.status == 1) {
                    let ticketData = data.data;
                    this.urgency= ticketData.urgency
                    this.message = ticketData.message
                    this.ticketStatus =ticketData.ticketStatus;
                    this.subject=ticketData.subject
                    this.image = ticketData.ticketFile
                    this.addEditTicketForm.patchValue({
                        ticketId:ticketData.ticketId,
                        urgency:ticketData.urgency,
                        subject:ticketData.subject,
                        message:ticketData.message,
                    });
                    this.documentName=data.data.ticketFile.split("/").pop()
                    this.document=data.data.ticketFile
                }
            }, err => {
                swal.fire('Error!', err.error.message, 'info').then();
            });

        }else{
            this.addEditTicketForm = this.fb.group({
                userId: [this.userId],
                urgency: ['', [Validators.required]],
                subject: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
                message: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
            })

        }
    }


    ngOnInit(): void {
    }

    changed() {
        this.fileStatus === false ? this.fileStatus = true : this.fileStatus = false;
    }

    onFileChanged(event: any) {
        this.fileUpload = true;
        this.documentName = event.target.files[0].name;
        this.document = event.target.files[0]
        var validFormats = ['jpeg', 'jpg', 'png', 'bmp','svg'];
        const exc = this.documentName.split('.').pop();
        if (validFormats.includes(exc)) {
            const blob = new Blob([this.document], {type: this.document.type});
            this.imagePreview = window.URL.createObjectURL(blob);
        this.image = this.sanitizer.bypassSecurityTrustUrl(this.imagePreview);
        } else {
            this.documentName = ''
            swal.fire(
                '',
                'Invalid image extension!',
                'info'
            ).then(()=>{
                this.document = null
                this.documentName = null
                this.myInputVariable.nativeElement.value = '';
                this.fileUpload = false;
            });
        }
    }
    resetCoverValue() {
        this.myInputVariable.nativeElement.value = '';
        this.document = null;
        this.documentName = null;
    }


    goBack = () => {
        this.router.navigate(['/ticket-management']).then();
    }

    keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }


    previewImage(content: any, document: any) {
            if (document && content) {
                const exc = document.lastIndexOf('.')
                const extension = document.substring(exc);
                this.modle.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any) => {
                    if (result) {
                    }
                    // this.closeResult = `Closed with: ${result}`;
                }, (reason) => {
                    // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                });
            }
        }

    onSubmit(){
        let formData: FormData = new FormData();
        if(this.addEditTicketForm.valid) {
            this.helper.toggleLoaderVisibility(true)
            let getInputsValues = this.addEditTicketForm.value;
            for (let key in getInputsValues) {
                formData.append(key, (getInputsValues[key]) ? getInputsValues[key] : '');
            }
            if (this.fileUpload) {
                formData.append("ticketFile", this.document, this.documentName)
            }
                this.apiService.addEditTicket(formData).subscribe((data: any) => {
                    if (data.meta.status === 1){
                        this.setIsClicked()
                        this.router.navigate(['/ticket-management']).then();
                        swal.fire('', data.meta.message, 'success');
                    } else {
                        swal.fire('Info!', data.meta.message, 'info');
                    }
                    this.helper.toggleLoaderVisibility(false)
                }, (err) => {
                    this.helper.toggleLoaderVisibility(false)
                    swal.fire('Error!', err.error.message, 'error');
                });
            }
    }

    backToTicketList(){
        this.setIsClicked()
        this.router.navigate(['/ticket-management']).then();
    }

    setIsClicked(){
        localStorage.setItem('isClicked',JSON.stringify(true))
    }

}
