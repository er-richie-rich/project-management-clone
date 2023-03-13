import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PMApiServicesService} from 'src/services/PMApiServices.service';
import swal from 'sweetalert2';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {PMHelperService} from "../../../services/PMHelper.service";

@Component({
	selector: 'app-announcement',
	templateUrl: './announcement.component.html',
	styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit,AfterViewInit {
	annoucementForm: any = FormGroup;
	submitted: boolean = false;
	config: AngularEditorConfig = {
		editable: true,
		spellcheck: true,
		height: '250px',
		minHeight: '0',
		maxHeight: 'auto',
		width: 'auto',
		minWidth: '0',
		translate: 'yes',
		enableToolbar: true,
		showToolbar: true,
		placeholder: 'Enter text here...',
		defaultParagraphSeparator: '',
		defaultFontName: 'Arial',
		defaultFontSize: '',
		toolbarHiddenButtons: [
			['insertVideo'],
			['strikeThrough'],
			['underline'],
			['undo'],
			['redo'],
		],
		customClasses: [
			{
				name: "quote",
				class: "quote",
			},
			{
				name: 'redText',
				class: 'redText'
			},
			{
				name: "titleText",
				class: "titleText",
				tag: "h1",
			},
		]
	};
	
	constructor(
		private _formBuilder: FormBuilder,
		private apiService: PMApiServicesService,
		public route: ActivatedRoute,
		public helper:PMHelperService
	) {
	}

	get newAnnouncementFormControl() {
		return this.annoucementForm.controls;
	}

	ngAfterViewInit(): void {
		document.getElementById("ngEditor")?.addEventListener("click", () => {
			document.getElementById("ngEditor")?.focus();
		});
    }
	
	ngOnInit() {
		this.helper.removeIsClicked()
		this.annoucementForm = this._formBuilder.group({
			title: [''],
			description: ['', Validators.compose([Validators.required])],
		});
	}
	
	space(event: any) {
		if (event.target.selectionStart === 0 && event.code === 'Space') {
			event.preventDefault();
		}
	}
	
	onBroadcast() {
		this.submitted = true;
		if (this.annoucementForm.valid) {
			this.apiService.onAnnouncement(this.annoucementForm.value).subscribe((data: any) => {
				if (data.meta.status === 0) {
					swal.fire('', data.meta.message, 'info');
				} else {
					swal.fire('', data.meta.message, 'success');
					setTimeout(() => {
						 location.reload()
					}, 1000)
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
			})
		}
	}
}
