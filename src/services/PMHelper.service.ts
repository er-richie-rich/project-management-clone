import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractControl, FormControl} from '@angular/forms';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class noWhitespaceValidation {
    static noWhitespaceValidator(control: FormControl): any {
        const isWhitespace = (control && control.value && control.value.toString() || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : {required: true};
    }
}
export class PMHelperService {
  public static authUser: any = {};
  public static loginUserData: any = {};
  public static loginUserID: any = "0";
  public static loginUserMetaData:any;
  public static resetPasswordToken: any = "";
  public static userRole: any = {};
  public static roleName: any = {};
  public messageCount = new Subject<number>();
  public loginAdminData: any;
  loaderVisibilityChange:Subject<boolean> = new Subject<boolean>();
  isLoaderVisible:boolean = false;

  constructor() {
  }

  public static onLogOut(): void {
    window.localStorage.removeItem("tokenData");
    window.localStorage.removeItem("loggedInUser");
    window.localStorage.removeItem("loginId");
    //localStorage.clear();
  }

  public static responseMeta(loginUser: any) {
   return new Promise( (resolve, reject) => {
     let loginMetaData = (loginUser?.meta) ? loginUser?.meta : null;
      if(loginMetaData && loginMetaData?.status === 1) {
        resolve(loginUser);
      } else {
        reject(loginUser);
      }
   })
 }

  public static findWithAttr(array: any, attr: any, value: any) {
    for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
        return i;
      }
    }
    return null;
  }

  public static findWithValue(array: any, attr: any, value: any) {
    for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
        return array[i];
      }
    }
    return null;
  }

  getUserData() {
    this.loginAdminData = localStorage.getItem('loggedInUser');
    return JSON.parse(this.loginAdminData);
  }

  toggleLoaderVisibility(isSidebarVisible: boolean): void {
      this.isLoaderVisible = isSidebarVisible;
      this.loaderVisibilityChange.next(isSidebarVisible);
  }

    spaceTrim(event:any){
        event.target.addEventListener('focusin', () => { event.target.value = event.target.value.trim()});
        event.target.value=event.target.value.replace(/\s\s+/g, ' ')
        event.target.addEventListener('focusout', () => { event.target.value = event.target.value.trim()});
    }

    removeIsClicked(){
        let isClicked = localStorage.getItem('isClicked');
        if(!isClicked){
            localStorage.removeItem('page')
            localStorage.removeItem('perPage')
        }
    }
}
