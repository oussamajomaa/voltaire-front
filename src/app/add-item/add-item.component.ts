import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../services/book.service';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
	selector: 'app-add-item',
	templateUrl: './add-item.component.html',
	styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

	form: any = FormGroup
	books: any = []
	yes = "yes"
	onMultivolume = false

	pageSlice: any = []
	pageEvent: PageEvent;

	savedContributors = []
	contributors = []

	book_id: number
	contibutorStatus: string

	translators = []
	authors = []
	selectedTranslators = []
	selectedAuthors = []

	// Variables

	title=''
	publisher=''
	publication_place=''
	publication_date=''
	publisher_stated=''
	publication_place_stated=''
	publication_date_stated=''
	type_document=''
	multivolume=''
	volume=1
	format=''
	source=''
	marginalia=''
	binding=''
	library=''
	cote=''
	provenance=''
	ferney=''
	digital_voltaire=''
	external_resource=''
	notes=''

	// Variables



	constructor(
		private formBuilder: FormBuilder,
		private bookService: BookService,
		private toastService: ToastrService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.initForm()
		this.getContributor()
	}

	getContributor() {
		this.bookService.getContributors().subscribe((res: any) => {
			// this.contributors = res
			this.authors = res.filter(item => item.status === 'author')
			this.translators = res.filter(item => item.status === 'translator')
			// console.log(this.authors);
			// console.log(this.translators);

		})
	}


	initForm() {
		this.form = this.formBuilder.group(
			{
				title: ['', Validators.required],
				publisher: [''],
				publication_place: [''],
				publication_date: [''],
				publisher_stated: [''],
				publication_place_stated: [''],
				publication_date_stated: [''],
				type_document: [''],
				multivolume: ['0'],
				volume: ['1'],
				format: [''],
				source: [''],
				marginalia: [''],
				binding: [''],
				library: [''],
				cote: [''],
				provenance: [''],
				ferney: [''],
				digital_voltaire: [''],
				external_resource: [''],
				notes: [''],
			}
		)
	}

	submit() {
		let book = {
			title:this.title,
			publisher:this.publisher,
			publication_place:this.publication_place,
			publication_date:this.publication_date,
			publisher_stated:this.publisher_stated,
			publication_place_stated:this.publication_place_stated,
			publication_date_stated:this.publication_date_stated,
			type_document:this.type_document,
			multivolume:this.multivolume,
			volume:this.volume,
			format:this.format,
			source:this.source,
			marginalia:this.marginalia,
			binding:this.binding,
			library:this.library,
			cote:this.cote,
			provenance:this.provenance,
			ferney:this.ferney,
			digital_voltaire:this.digital_voltaire,
			external_resource:this.external_resource,
			notes: this.notes,
			user_id:''
		}
		this.contributors = this.selectedAuthors.concat(this.selectedTranslators)
		console.log(this.contributors);
		if (book.multivolume === "") book.multivolume = "no"
		if (book.multivolume === "no") book.volume = 1
		// if (this.form.value.multivolume === "") this.form.value.multivolume = "no"
		// if (this.form.value.multivolume === "no") this.form.value.volume = 1
		// if (this.form.value.title) {
		if (book.title) {
			console.log(book);
			
			// this.form.value.user_id = localStorage.getItem('id')
			book.user_id = localStorage.getItem('id')
			// this.bookService.addBook(this.form.value)
			this.bookService.addBook(book)
				.subscribe((res: any) => {
					this.book_id = res.book_id
					if (this.book_id) {
						this.contributors.forEach(id => {
							let item = {
								book_id: this.book_id,
								contributor_id: id
							}
							this.bookService.addBookContributor(item).subscribe((res: any) => {
							})
						})
						this.toastService.success(res.message);
					}
				})
			// this.form.reset()
			this.router.navigate(['book'])
		}
		else {
			this.toastService.error("Please enter the required fields !!");
		}
	}

	cancelAdd() {
		this.router.navigate(['book'])
	}


	onPageChange(event: PageEvent) {
		const startIndex = event.pageIndex * event.pageSize
		let endIndex = startIndex + event.pageSize
		if (endIndex > this.books.length) {
			endIndex = this.books.length
		}
		this.pageSlice = this.books.slice(startIndex, endIndex)
	}

}
