import {AfterContentChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PMApiServicesService} from "../../../../services/PMApiServices.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import swal from "sweetalert2";
import {PMHelperService} from "../../../../services/PMHelper.service";


export class Message {
    constructor(public ticketId: string, public message: string) {}
}
@Component({
    selector: 'app-ticket-details',
    templateUrl: './ticket-details.component.html',
    styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit,AfterContentChecked {
    user: any;
    view: any;
    ticketId: any;
    name: any
    email: any
    status: any;
    subject: any;
    ticketCode: any;
    ticketStatus:string=''
    urgency: any;
    message: any;
    userRole: any;
    attachImage: any;
    messages: any;
    value: string = '';
    loggedUserId:String ='';
    @ViewChild('scrollMe') scrollMe!: ElementRef;
    scrollTop: number = 0;
    constructor(
        private apiService: PMApiServicesService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public helper : PMHelperService,
    ) {
        this.user = JSON.parse(localStorage.getItem('loggedInUser') || '{}')
        if (this.user) {
            this.userRole = this.user.roleKey
            this.loggedUserId = this.user.userId
         }
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
                this.ticketId = params.id;
            }
        )
        this.viewTicket()
    }

    ngAfterContentChecked(): void {
        this.scrollTop = this.scrollMe?.nativeElement.scrollHeight;
    }
    viewTicket = () => {
        this.apiService.viewTicket({ticketId: this.ticketId}).subscribe(
            data => {
                if (data && data?.meta && data.meta.status == 1) {
                    this.view = data.data;
                    this.ticketCode = this.view.ticketCode
                    this.urgency = this.view.urgency
                    this.status = this.view.ticketStatus
                    this.subject = this.view.subject
                    this.message = this.view.message
                    this.name = this.view.userName
                    this.email = this.view.email
                    this.attachImage = this.view.ticketFile
                    this.messages = this.view.ticketConversationData
                    this.ticketStatus=this.view.ticketStatus
                }
            }
        )

    }

    sendMessage(value:any) {
        let message = value.trim()
        if(message === ''){
        } else {
            if (this.value){
                let data = new Message(this.ticketId, message);
                this.helper.toggleLoaderVisibility(true)
                this.apiService.sendMessage(data).subscribe(data => {
                    if (data.meta.status === 1){
                        this.messages.push(data.data)
                        this.value = '';
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
    }
    openImage(){
        window.open(this.attachImage)
    }
    backToTicketList(){
        this.setIsClicked()
        this.router.navigate(['/ticket-management']).then();
    }

    setIsClicked(){
        localStorage.setItem('isClicked',JSON.stringify(true))
    }
    space(event: any) {
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
        }
    }
}
