import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../services/book.service';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, filter, distinctUntilChanged, debounceTime,startWith, switchMap, tap } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Classification } from '../add-item/classification';


@Component({
	selector: 'app-edit-item',
	templateUrl: './edit-item.component.html',
	styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

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
	classifications: any = []
	descriptions = []
	inputAuthor = ""
	book_id: number
	book: any
	selectedContributors = []
	select2allAuthors: any = []
	select2allTranslators: any = []
	select2allCopyists: any = []
	isSearching:boolean

	ids = []
	constructor(
		private bookService: BookService,
		private router: Router,
		private route: ActivatedRoute,
		private toastService: ToastrService,
	) { }

	allClassifications = []


	ngOnInit(): void {
		// get book id
		this.book_id = this.route.snapshot.queryParams.id

		// get classification for a specific book a,d put it in list descriptions
		this.bookService.getClassification(this.book_id).subscribe((res: any) => {
			res.map(item => {
				this.descriptions.push(item.description)
			})
		})		


		// get list objects of classifications
		this.allClassifications = new Classification().librariesClassification

		// get the specific book
		// this.getOneBook()
		this.bookService.getOneBook(this.book_id).subscribe(res => {
			this.book = res[0]
		})

		// get all contributors
		this.bookService.getContributors().subscribe((res: any) => {
			this.allContributors = res
			this.allContributors.map(contributor => {
				return contributor.name = contributor.last_name + ' ' + contributor.first_name
			})
		})



		// get all contributors for a specific book
		this.getBokkContributor()

		this.filteredallAuthors = this.authorCtrl.valueChanges.pipe(
			filter(res => {
				return res !== null && res.length > 2
			  }),	
			map((author: string | null) => author ? this._filter(author) : this.allContributors.slice()))

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



	changeInputAuthor(){
		if (this.authorInput.nativeElement.value.length < 3)
		console.log(this.authorInput.nativeElement.value)
		console.log(this.inputAuthor);
	}

	// add a new contributor to a list
	add(event: MatChipInputEvent, contributors: any[], ctrl: FormControl): void {
		const value = (event.value || '').trim();
			// Add our author
		if (value) {
			contributors.push(value)
		}
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

	// remove a contributor from a list
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

	// displaying contributors 
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
		return this.allContributors.filter(contributor => (contributor.name.toLowerCase()).includes(value))
	}

	getOneBook() {
		this.bookService.getOneBook(this.book_id).subscribe(res => {
			this.book = res[0]
		})
	}

	submit() {
		// this.ids = []
		// let array = []
		// this.selectedContributors = this.selectedAuthors.concat(this.selectedTranslators)
		// this.selectedContributors.map(name => {
		// 	array.push(this.contributors.filter(contributor => contributor.name === name))
		// })
		// array.map(item => this.ids.push(item[0].id))
		// console.log(this.ids);


		if (this.book.multivolume === "") this.book.multivolume = "no"
		if (this.book.multivolume === "no") this.book.volume = 1
		if (!this.book.pot_pourri) this.book.pot_pourri = 0
		if (!this.book.vol_number) this.book.vol_number = 0
		if (this.book.title) {
			this.book.user_update = localStorage.getItem('id')
			this.book.update_date = new Date().toLocaleString().slice(0, 10)

			this.bookService.updateBook(this.book)
				.subscribe((res: any) => {
					// add authors if exist
					this.allAuthors.forEach(author => {
						let item = {
							book_id: this.book_id,
							contributor_id: author.id,
							status: "author"
						}
						this.bookService.addBookContributor(item).subscribe((res: any) => { })
					})
					// add translators if exist
					this.allTranslators.forEach(translator => {
						let item = {
							book_id: this.book_id,
							contributor_id: translator.id,
							status: "translator"
						}
						this.bookService.addBookContributor(item).subscribe((res: any) => { })
					})
					// add copystes if exist
					this.allCopystes.forEach(copyste => {
						let item = {
							book_id: this.book_id,
							contributor_id: copyste.id,
							status: "copyste"
						}
						this.bookService.addBookContributor(item).subscribe((res: any) => { })
					})

					// add copystes if exist
					this.allEditors.forEach(editor => {
						let item = {
							book_id: this.book_id,
							contributor_id: editor.id,
							status: "editor"
						}
						this.bookService.addBookContributor(item).subscribe((res: any) => { })
					})

					this.descriptions.forEach(description => {
						let item = {
							book_id: this.book_id,
							description: description
						}
						this.bookService.addClassification(item).subscribe((res: any) => { })
					})
					this.toastService.success(res.message);
					this.router.navigateByUrl('book')
				})
		}
		else {
			this.toastService.error("Please enter the required fields !!");
		}
	}

	// get all contributors for a specific book
	getBokkContributor() {
		this.bookService.getBookContributor(this.book_id)
			.subscribe((res: any) => {
				// récupérer les contributors selon leur role et les stocker 
				// temporairement dans des list
				this.allAuthors = res.filter(item => item.status === 'author')
				this.allTranslators = res.filter(item => item.status === 'translator')
				this.allCopystes = res.filter(item => item.status === 'copyste')	
				this.allEditors = res.filter(item => item.status === 'editor')			
			})
	}

	valuechange(event) {
		this.book.title = (event.target.value);

	}

	cancelUpdate() {
		this.router.navigateByUrl('book')
	}
}
