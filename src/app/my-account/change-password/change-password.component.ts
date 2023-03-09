import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import {PMHelperService} from 'src/services/PMHelper.service';
import swal from 'sweetalert2';
import {dateValidation} from "../../employee-management/add-edit-employee/add-edit-employee-custom.validators";

export function isEqual(): any {
	return (group: FormGroup): ValidationErrors => {
		const password = group.controls['password'];
		const newPassword = group.controls['newpassword'];
		if (password.value && newPassword.value) {
			if (password.value === newPassword.value){
				newPassword.setErrors({equal: true});
			} else {
				newPassword.setErrors(null);
			}
		}
		return {};
	};
}
@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
	
	changePasswordForm: any = FormGroup;
	
	constructor(
		private _formBuilder: FormBuilder,
		private apiService: PMApiServicesService,
		private router: Router,
		public route: ActivatedRoute,
		public helper: PMHelperService
	) {
		this.createForm()
		this.changePasswordForm.setValidators(isEqual())
		
	}
	
	ngOnInit(): void {
	}
	
	createForm() {
		this.changePasswordForm = this._formBuilder.group({
				password: [''],
				newpassword: [''],
				confirmPassword: [''],
			},
			{validator: this.checkIfMatchingPasswords('newpassword', 'confirmPassword')},
		);
	}
	
	changePassword() {
		// Current password and new password should not be same
		if (this.changePasswordForm.valid) {
			this.apiService.changePassword(this.changePasswordForm.value).subscribe((data: any) => {
				if (data && data?.meta && data.meta.status == 1) {
					swal.fire({
						icon: 'success',
						title: data.meta.message,
						showConfirmButton: false,
						timer: 2000
					}).then(() => {
						location.reload()
					});
				} else {
					swal.fire(
						'',
						data.meta.message,
						'error'

					).then();
				}
			});
		}
	}
	
	checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
		return (resetPasswordForm: FormGroup) => {
			let password = resetPasswordForm.controls[passwordKey],
				confirmPassword = resetPasswordForm.controls[passwordConfirmationKey];
			if (confirmPassword.value) {
				if (password.value !== confirmPassword.value) {
					return confirmPassword.setErrors({notEquivalent: true});
				} else {
					return confirmPassword.setErrors(null);
				}
			}
			
		}
	}
	
	checkPasswordMatch = () => {
		if (this.changePasswordForm.value.password) {
		
		}
	}
	
}

function data(data: any) {
	throw new Error('Function not implemented.');
}

