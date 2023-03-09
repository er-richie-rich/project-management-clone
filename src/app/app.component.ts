import {ChangeDetectorRef, Component, HostListener} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {Router, Event, NavigationEnd, ActivatedRoute, RoutesRecognized} from '@angular/router';
import { filter } from 'rxjs/operators';
import {PMHelperService} from "../services/PMHelper.service";
import {PMApiServicesService} from "../services/PMApiServices.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ProjectManagementSystem';
  LoaderVisible:boolean = false;
  constructor(
      private helper : PMHelperService,
      private cdRef: ChangeDetectorRef,
      private apiService:PMApiServicesService,
      private router: Router) {
    this.helper.loaderVisibilityChange.subscribe((value) => {
      this.LoaderVisible = value;
      this.cdRef.detectChanges();
    })

    router.events.subscribe((event: Event) => {
      if (event instanceof RoutesRecognized) {
        this.apiService.getUnReadTicketCount({}).subscribe(
            data => {
              if (data && data?.meta) {
                if (data.meta.status == 1) {
                  this.helper.messageCount.next(data.data.unReadCount)
                }
              }
            })
      }
    });
}

  setIsClicked(){
    localStorage.setItem('isClicked',JSON.stringify(true))
  }
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.setIsClicked()
  }

}
