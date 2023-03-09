import {DOCUMENT} from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {PMHelperService} from "../../../services/PMHelper.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, AfterViewInit {
  @ViewChild("caption") caption!: ElementRef;
  roleName = "";
  authUser: any = {};
  panelOpenState = false;
  open:boolean = false;
  unReadTicketCount : number = 0;
  constructor(@Inject(DOCUMENT) private document: Document,
              public elementRef: ElementRef,
              private renderer: Renderer2,
              private helper:PMHelperService,
              private router: Router
  ) {
    this.getUnreadTicketCount()
    let authUser: any = localStorage.getItem('loggedInUser');
    if (authUser) {
      this.authUser = JSON.parse(authUser);
      this.roleName = this.authUser.roleKey
    }
  }

  ngOnInit(): void {
    if(this.router.url.includes('/leave-management')){
      this.open = true
      this.renderer.addClass(this.document.body, 'submenu-open');
    }
  }

  ngAfterViewInit(): void {
  }

  getUnreadTicketCount()
  {
    this.helper.messageCount.subscribe(result=>{
     this.unReadTicketCount = result
    })
  }
  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }

  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  
  showSubMenu(){
     if(this.open){
       this.open = false;
       this.renderer.removeClass(this.document.body, 'submenu-open');
     }
     else {
       this.open = true;
       this.renderer.addClass(this.document.body, 'submenu-open');
     }
  }

}
