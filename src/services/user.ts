//login
export interface User {
  email: string;
  password: string;
}
export interface forgotpassword{
  email: string;
}
export interface resetPassword{
  newPassword:string,
  confirmPassword:string
}


//My-Account
export interface myProfile{
  name:string,
  email:string,
  phone: string,
  designation: string,
}
export interface changePassword{
  currentPassword: string,
  newPassword: string,
  confirmPassword:string,
}
//Project-Module
export interface addProject{
  projectCode:string,
  projectName:string,
  clientName:string,
  startDate:string,
  technology:string,
  status:string,
}
export interface addMilestone{
  title: string,
  status: string,
  amount:string,
}
export interface addChangeReq{
  title:string,
  version:string,
  estimation:string,
  receiveDate:string,
  description:string,
}
export interface addFile{
  addFile: string,
  date: string,

}
//User Management
export interface addUser{
  fullName: string,
  emailId: string,
  phone:string,
  role: string,
  status:string,
}

