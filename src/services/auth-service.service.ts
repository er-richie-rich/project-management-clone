import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User,addProject,forgotpassword,resetPassword,changePassword,myProfile,addMilestone,addChangeReq,addFile,addUser} from './user';
import swal from 'sweetalert2';
import { PMApiServicesService } from './PMApiServices.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private apiService:PMApiServicesService
  ) {}

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  //user login,signup,reset,forgot
  login(user: User) {
    if (user.email !== '' && user.password !== '' ) {
      this.loggedIn.next(true);
      swal.fire({
        icon: 'success',
        title: 'Thanks for login !',
        showConfirmButton: false,
        timer: 1500
      });
      this.router.navigate(['/dashboard']);
    }
  }

  forgotpassword(forgotpassword: forgotpassword) {
    if (forgotpassword.email !== '') {
      this.loggedIn.next(true);
     swal.fire(
      {
        icon: 'success',
        title: 'Please reset your password!',
        showConfirmButton: false,
        timer: 1500
      }

       );
      this.router.navigate(['/reset-password']);
    }
  }
  resetPassword(resetPassword: resetPassword) {
    if (resetPassword.newPassword !== ''
    && resetPassword.confirmPassword !== '' ) {
      this.loggedIn.next(true);
     swal.fire(
      {
        icon: 'success',
        title: 'Your Password has been reset successfully! !',
        showConfirmButton: false,
        timer: 1500
      }

       );
      this.router.navigate(['/login']);
    }
  }
  logout() {
    this.loggedIn.next(false);
    swal.fire(
      {
        icon: 'success',
        title:  'Logged Out Successfully!',
        showConfirmButton: false,
        timer: 1500
      });
    this.router.navigate(['/']);
  }
  //My-Account-Management
  myProfile(myProfile:myProfile) {
    if (myProfile. name !== '' && myProfile.email !== '' && myProfile.phone!== '') {
      this.loggedIn.next(true);
      swal.fire(
        {
          icon: 'success',
          title:   'Your Profile has been created successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      this.router.navigate(['/dashboard']);
    }
  }

  changePassword(changePassword:changePassword) {
    if (changePassword.currentPassword !== '' && changePassword.newPassword !== '' && changePassword.confirmPassword !== ''  ) {
      this.loggedIn.next(true);
      swal.fire(
      {
          icon: 'success',
          title:  'Your Password has been Changed successfully! !',
          showConfirmButton: false,
          timer: 1500
        }
       );
      this.router.navigate(['/login']);
    }

  }

  //Project-Management
  addProject(addProject:addProject){
    if (addProject.projectCode !== ''
    && addProject.projectName!== ''
    && addProject.clientName !== ''
    && addProject.startDate !== ''
    && addProject.technology !== ''
    && addProject.status !== ''
    ) {
      this.loggedIn.next(true);
      swal.fire(
        {
          icon: 'success',
          title:'New Project has been created successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      this.router.navigate(['/project-management']);}
  }
  addMilestone(addProject:addMilestone){
    if (addProject.title !== ''
    && addProject.status!== ''
    && addProject.amount !== '') {
      this.loggedIn.next(true);
      swal.fire(
        {
          icon: 'success',
          title:'New Milestone has been created successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      this.router.navigate(['/project-management/project-details']);}
  }
  addChangeReq(addProject:addChangeReq){
    if (addProject.title !== ''
    && addProject.version!== ''
    && addProject.estimation !== ''
    && addProject.receiveDate!== ''
    && addProject.description!== ''
   ) {
      this.loggedIn.next(true);
      swal.fire(
        {
          icon: 'success',
          title:'Add Change Request has been created successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      this.router.navigate(['/project-management/project-details/change-request']);}
  }
  addFile(addProject:addFile){
    if (addProject.addFile !== ''
    && addProject.date!== '') {
      this.loggedIn.next(true);
      swal.fire(
        {
          icon: 'success',
          title:'Your File has been uploded successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      this.router.navigate(['/project-management/project-details/files-manage']);}
  }

  //User-Management
  addUser(addProject:addUser){
    if (addProject.fullName !== ''
    && addProject.emailId!== ''
    && addProject.phone!== ''
    && addProject.role!== ''
    && addProject.status !== ''
    ) {
      this.loggedIn.next(true);
      swal.fire(
        {
          icon: 'success',
          title:'User has been created successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      this.router.navigate(['/user-management']);}
  }


}
