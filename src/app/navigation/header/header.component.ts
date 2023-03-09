import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {PMHelperService} from 'src/services/PMHelper.service';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {PMApiServicesService} from 'src/services/PMApiServices.service';


const document: any = window.document;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  title: any;
  public config: any = {};
  panelOpenState = false;
  userDetailsData: any = {};
  url: any = 'assets/images/profile-picture-default.png';
  profileImage: any;
  userNames: any;
  user_name: any;
  profile_img: any;
  adminData: any;
  adminName: any;
  nameOfUser: any;
  profileImg: any;
  _profileImg: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    public helper: PMHelperService,
    public apiService: PMApiServicesService,
    private cd: ChangeDetectorRef,
    public elementRef: ElementRef,
  ) {
    this.adminData = this.helper.getUserData();
    this.adminName = this.adminData.fullName;
    this._profileImg = this.adminName.profileImage;
  }

  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }

  ngOnInit() {
    const rt = this.getChild(this.activatedRoute);
    rt.data.subscribe((data: any) => {
      this.title = data.title;
      this.titleService.setTitle(this.title);
    });
    this.apiService
      .getUserdetail(PMHelperService.loginUserID).subscribe((data: any) => {
        this.userDetailsData = data.data;
        this.user_name = this.userDetailsData.fullName;
        this.profile_img = this.userDetailsData.profileImage;
      });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const rt = this.getChild(this.activatedRoute);
        rt.data.subscribe((data: any) => {
          this.title = data.title;
          this.titleService.setTitle(this.title);
        });
      });
  }

  ngAfterViewChecked() {
    this.adminData = localStorage.getItem("loggedInUser");
    this.adminName = JSON.parse(this.adminData);
    this.nameOfUser = this.adminName?.fullName;
    // this._profileImg = this.adminName.profileImage;
    this.profile_img = this.adminName.profileImage;
    this.cd.detectChanges()
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  logOUT() {
    PMHelperService.onLogOut();
    this.router.navigate(['/']);
  }
}
