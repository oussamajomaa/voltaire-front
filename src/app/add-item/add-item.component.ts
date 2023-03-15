import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BookService } from '../services/book.service';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, filter, distinctUntilChanged, debounceTime,startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Classification } from './classification';

@Component({
	selector: 'app-add-item',
	templateUrl: './add-item.component.html',
	styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
	@ViewChild('authorInput') authorInput: ElementRef;
	@ViewChild('translatorInput') translatorInput: ElementRef;
	@ViewChild('copysteInput') copysteInput: ElementRef;
	@ViewChild('editorInput') editorInput: ElementRef;

	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = false;
	separatorKeysCodes: number[] = [ENTER, COMMA]
	authorCtrl = new FormControl()
	translatorCtrl = new FormControl()
	copysteCtrl = new FormControl()
	editorCtrl = new FormControl()

	filteredallAuthors: Observable<any[]>
	filteredallTranslators: Observable<any[]>
	filteredallCopystes: Observable<any[]>
	filteredallEditors: Observable<any[]>
	allAuthors: any = []
	allTranslators: any = []
	allCopystes: any = []
	allEditors: any = []
	allContributors: any = []




	form: any = FormGroup
	books: any = []
	yes = "yes"
	onMultivolume = false

	pageSlice: any = []
	pageEvent: PageEvent;

	savedContributors = []
	contributors:any = []

	book_id: number
	contibutorStatus: string

	// translators = []
	// authors = []
	// selectedTranslators = []
	// selectedAuthors = []

	// Variables

	title = ''
	publisher = ''
	publisher_stated = ''
	publication_place = ''
	publication_date = ''
	publication_place_stated = ''
	publication_date_stated = ''
	type_document = ''
	multivolume = ''
	volume:number
	source = ''
	marginalia = ''
	library = ''
	cote = ''
	provenance = ''
	ferney = ''
	digital_voltaire = ''
	external_resource = ''
	pot_pourri:number
	classification = []
	notes = ''
	status = ''
	vol_number:number
	// classificationControl = new FormControl()
	classifications:any = []
	// Variables

	// select2allAuthors:any= []
	// select2allTranslators:any= []
	// select2allCopyists:any= []

	constructor(
		private formBuilder: FormBuilder,
		private bookService: BookService,
		private toastService: ToastrService,
		private router: Router,
	) { }

	ngOnInit(): void {
		this.classifications = new Classification().librariesClassification
		this.initForm()
		// this.getContributor()
		this.bookService.getContributors().subscribe((res: any) => {
			this.allContributors = res
			this.allContributors.map(contributor => {
				return contributor.name = contributor.last_name + ' ' +contributor.first_name
			})
		})
		
		// jquery('#author').select2({
		// 	minimumInputLength: 3,
		// 	placeholder:"select an author",
		// })
		// jquery('#translator').select2({
		// 	minimumInputLength: 3,
		// 	placeholder:"select a translator",
		// })
		// jquery('#copyist').select2({
		// 	minimumInputLength: 3,
		// 	placeholder:"select a copyist",
		// })
		
		
		
		this.filteredallAuthors = this.authorCtrl.valueChanges.pipe(
			filter(res => {
				return res !== null && res.length > 2
			  }),
			  distinctUntilChanged(),
			map((author: string | null) => author ? this._filter(author) : this.allContributors.slice()));

		this.filteredallTranslators = this.translatorCtrl.valueChanges.pipe(
			filter(res => {
				return res !== null && res.length > 2
			  }),
			  distinctUntilChanged(),
			map((translator: string | null) => translator ? this._filter(translator) : this.allContributors.slice()));
			
		this.filteredallCopystes = this.copysteCtrl.valueChanges.pipe(
			filter(res => {
				return res !== null && res.length > 2
			  }),
			  distinctUntilChanged(),
			map((copyste: string | null) => copyste ? this._filter(copyste) : this.allContributors.slice()));
		
		this.filteredallEditors = this.editorCtrl.valueChanges.pipe(
			filter(res => {
				return res !== null && res.length > 2
				}),
				distinctUntilChanged(),
			map((editor: string | null) => editor ? this._filter(editor) : this.allContributors.slice()));

	}

	// onSelectAuthor(event:any){
	// 	console.log(event.target.value);
		
	// 	this.allAuthors = jquery('#author').val()
	// 	console.log(this.allAuthors);
	// }

	add(event: MatChipInputEvent, contributors: any[], ctrl: FormControl): void {
		const value = (event.value || '').trim();
		// Add our author
		if (value) contributors.push(value)
		// Clear the input value
		event.chipInput!.clear();
		ctrl.setValue(null);
		
	}

	addAuthor(event: MatChipInputEvent): void {
		this.add(event, this.allAuthors, this.authorCtrl)	
	}

	addTranslator(event: MatChipInputEvent): void {
		this.add(event, this.allTranslators, this.translatorCtrl)
	}

	addCopyste(event: MatChipInputEvent): void {
		this.add(event, this.allCopystes, this.copysteCtrl)
	}

	addEditor(event: MatChipInputEvent): void {
		this.add(event, this.allEditors, this.editorCtrl)
	}

	remove(contributor: any, contributors: any[]): void {
		const index = contributors.indexOf(contributor);
		if (index >= 0) contributors.splice(index, 1);
	}


	removeAuthor(contributor: any): void {
		this.remove(contributor, this.allAuthors)
	}

	removeTranslator(contributor: any): void {
		this.remove(contributor, this.allTranslators)
	}

	removeCopyste(contributor: any): void {
		this.remove(contributor, this.allCopystes)
	}

	removeEditor(contributor: any): void {
		this.remove(contributor, this.allEditors)
	}

	selectedContributor(event: MatAutocompleteSelectedEvent, contributors: any[], ctrl: FormControl, input: any): void {
		contributors.push(event.option.value);
		input.nativeElement.value = '';
		ctrl.setValue(null);	
	}

	selectedAuthor(event: MatAutocompleteSelectedEvent): void {
		this.selectedContributor(event, this.allAuthors, this.authorCtrl, this.authorInput)
	}

	selectedTranslator(event: MatAutocompleteSelectedEvent): void {
		this.selectedContributor(event, this.allTranslators, this.translatorCtrl, this.translatorInput)
	}

	selectedCopyste(event: MatAutocompleteSelectedEvent): void {
		this.selectedContributor(event, this.allCopystes, this.copysteCtrl, this.copysteInput)
	}

	selectedEditor(event: MatAutocompleteSelectedEvent): void {
		this.selectedContributor(event, this.allEditors, this.editorCtrl, this.editorInput)
	}

	private _filter(value: any): any[] {
		return this.allContributors.filter(contributor => contributor.name.toLowerCase().includes(value))
	}

	initForm() {
		this.form = this.formBuilder.group(
			{
				title: ['', Validators.required],
				publisher: [''],
				publisher_stated: [''],
				publication_place: [''],
				publication_date: [''],
				publication_place_stated: [''],
				publication_date_stated: [''],
				type_document: [''],
				multivolume: ['0'],
				volume: ['0'],
				source: [''],
				marginalia: [''],
				library: [''],
				cote: [''],
				provenance: [''],
				ferney: [''],
				digital_voltaire: [''],
				external_resource: [''],
				pot_pourri: ['0'],
				notes: [''],
				status: [''],
				vol_number: ['0'],
			}
		)
	}

	submit() {
		let book = {
			title: this.title,
			publisher: this.publisher,
			publisher_stated: this.publisher_stated,
			publication_place: this.publication_place,
			publication_date: this.publication_date,
			publication_place_stated: this.publication_place_stated,
			publication_date_stated: this.publication_date_stated,
			type_document: this.type_document,
			multivolume: this.multivolume,
			volume: this.volume,
			source: this.source,
			marginalia: this.marginalia,
			library: this.library,
			cote: this.cote,
			provenance: this.provenance,
			ferney: this.ferney,
			digital_voltaire: this.digital_voltaire,
			external_resource: this.external_resource,
			pot_pourri: this.pot_pourri,
			// classification:this.classification,
			notes: this.notes,
			user_id: '',
			status:this.status,
			vol_number:this.vol_number
		}

		if (book.multivolume === "") book.multivolume = "no"
		if (book.multivolume === "no") book.volume = 1
		if (!book.pot_pourri) book.pot_pourri = 0
		if (!book.vol_number) book.vol_number = 0
		
		if (book.title) {
			book.user_id = localStorage.getItem('id')
			this.bookService.addBook(book)
				.subscribe((res: any) => {
					// Get book_id after inserting a new book
					this.book_id = res.book_id
					
					if (this.book_id) {
						this.allAuthors.forEach(author => {
							let item = {
								book_id: this.book_id,
								contributor_id: author.id,
								status: "author"
							}
							this.bookService.addBookContributor(item).subscribe((res: any) => {								
							})
						})
						this.allTranslators.forEach(translator => {
							let item = {
								book_id: this.book_id,
								contributor_id: translator.id,
								status: "translator"
							}
							this.bookService.addBookContributor(item).subscribe((res: any) => {
							})
						})
						this.allCopystes.forEach(copyste => {
							let item = {
								book_id: this.book_id,
								contributor_id: copyste.id,
								status: "copyste"
							}
							this.bookService.addBookContributor(item).subscribe((res: any) => {
							})
						})

						this.allEditors.forEach(editor => {
							let item = {
								book_id: this.book_id,
								contributor_id: editor.id,
								status: "editor"
							}
							this.bookService.addBookContributor(item).subscribe((res: any) => {
							})
						})

						this.classification.forEach(element => {
							let item = {
								book_id: this.book_id,
								description:element
							}
							this.bookService.addClassification(item).subscribe((res: any) => {})
						});
						this.toastService.success(res.message);
					}
				})
			this.router.navigate(['book'])
		}
		else {
			this.toastService.error("Please enter the required fields !!");
		}
	}

	cancelAdd() {
		this.router.navigate(['book'])
	}


	// onPageChange(event: PageEvent) {
	// 	const startIndex = event.pageIndex * event.pageSize
	// 	let endIndex = startIndex + event.pageSize
	// 	if (endIndex > this.books.length) {
	// 		endIndex = this.books.length
	// 	}
	// 	this.pageSlice = this.books.slice(startIndex, endIndex)
	// }

}
