import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PMApiServicesService} from "../../../../services/PMApiServices.service";
import {Subscription} from "rxjs";
import swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {Inject} from '@angular/core';
import {noWhitespaceValidation, PMHelperService} from "../../../../services/PMHelper.service";

@Component({
	selector: 'app-add-edit-document-management',
	templateUrl: './add-edit-document-management.component.html',
	styleUrls: ['./add-edit-document-management.component.scss']
})


export class AddEditDocumentManagementComponent implements OnInit, OnDestroy {
	title: any = "Add";
	filePDF: any;
	document: any;
	addDocumenetForm: any = FormGroup;
	fileStatus: boolean = false;
	fileUplode: boolean = false;
	imagePreview: any;
	submitted: any = false;
	documentName: any;
	docRefName: any;
	status: any;
	output: any;
	extension: any;
	api!: Subscription;
	_documentData: any;
	
	
	constructor(
		private fb: FormBuilder,
		private apiService: PMApiServicesService,
		public activatedRoute: ActivatedRoute,
		private router: Router,
		private modle: NgbModal,
		private sanitizer: DomSanitizer,
		public helper:PMHelperService,
		@Inject(DOCUMENT) private doc: Document,
	) {
	}
	
	get addNewLeadFormControl() {
		return this.addDocumenetForm.controls;
	}
	
	ngOnInit(): void {
		const documentId: any = this.activatedRoute.snapshot.paramMap.get('id');
		this.doc.body.classList.add('custom-modal-width');
		this.addDocumenetForm = this.fb.group({
			documentId: [''],
			name: ['', [Validators.required,noWhitespaceValidation.noWhitespaceValidator]],
			status: [''],
		})
		if (documentId != 0) {
			this.title = "Edit";
			this.apiService.getDocument({documentId: documentId}).subscribe(
				data => {
					if (data && data?.meta && data.meta.status == 1) {
						let documentData = data.data;
						this.documentName = documentData.documentName;
						this.imagePreview = documentData.document;
						this.docRefName = documentData.document;
						this.document = documentData.document;
						documentData.isVisible === true ? this.fileStatus = true : this.fileStatus = false;
						this.addDocumenetForm.patchValue({
							documentId: documentData.documentId,
							name: documentData.documentName,
							status: documentData.status,
							document: documentData.document,
							isVisible: documentData.isVisible,
							// createdAt: 1660732843962
							// document: "http://122.169.113.151:3005/documents/document-1660732843859.xlsx"
							// documentId: "62fcc5ab9156463689ab957a"
							// documentName: "Test2"
							// isVisible: true
							// status: 1
							// updatedAt: 1664272610152
						});
					}
				},
				error => {
					swal.fire('Error!', error.error.message, 'info').then();
				},
				() => {
				}
			)
		}
	}
	
	changed() {
		this.fileStatus === false ? this.fileStatus = true : this.fileStatus = false;
	}
	
	onFileChanged(event: any) {
		this.docRefName = event.target.files[0].name;
		const exc = this.docRefName.split('.').pop();
		if (exc === 'pdf') {
			this.fileUplode = true;
			this.document = event.target.files[0]
			this.documentName = event.target.files[0].name;
			const blob = new Blob([this.document], {type: this.document.type});
			this.imagePreview = window.URL.createObjectURL(blob);
		} else {
			let message = "The document should be in PDF format only"
			swal.fire('Error!', message, 'info');
		}
	}
	
	ngOnDestroy(): void {
	}
	
	space(event: any) {
		if (event.target.selectionStart === 0 && event.code === 'Space') {
			event.preventDefault();
		}
	}
	
	onSubmit = (data: any) => {
		this.submitted = true;
		if (this.addDocumenetForm.valid && this.document && this.documentName) {
			const formData: FormData = new FormData();
			if (this.addDocumenetForm.value.documentId) {
				formData.append("documentId", this.addDocumenetForm.value.documentId)
			}
			if (this.fileUplode) {
				formData.append("document", this.document, this.documentName)
			}
			formData.append("documentName", this.addDocumenetForm.value.name)
			formData.append("isVisible", Boolean(this.fileStatus).toString())

			this.api = this.apiService.addEditDocument(formData).subscribe(
				data => {
					if (data.meta.status === 1) {
						this.setIsClicked()
						this.router.navigate(['/document-management']).then();
						swal.fire('', data.meta.message, 'success');
					} else {
						swal.fire('Info!', data.meta.message, 'info');
					}
				}, (err) => {
					swal.fire('Error!', err.error.message, 'error');
				});
		}
	}
	
	resetCoverValue() {
		this.filePDF = null;
		this.document = null;
		this.documentName = null;
		this.docRefName = null;
	}
	
	// Open modal
	openTemplate(content: any, document: any) {

		if (document && content) {
			const exc = document.lastIndexOf('.')
			this.extension = document.substring(exc);
			this.modle.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any) => {
				if (result) {
				}
				// this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				// this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			});
		}
	}
	
	
	change = () => {
		this.addDocumenetForm.controls["name"].setValue(null);
	}
	
	goBack = () => {
		this.router.navigate(['/document-management']).then();
	}
	
	keyPress(event: any) {
		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode != 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}

	backToDocumentList(){
		this.setIsClicked()
		this.router.navigate(['/document-management']).then();
	}

	setIsClicked(){
		localStorage.setItem('isClicked',JSON.stringify(true))
	}
}


