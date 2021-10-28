import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../services/book.service';
import { PageEvent } from '@angular/material/paginator';





@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	form: any = FormGroup
	books: any = []
	book_id:number
	onDelete = false
	pageSlice:any = []
	// MatPaginator Output
	pageEvent: PageEvent;

	constructor(
		private formBuilder: FormBuilder,
		private bookService: BookService,
		private http: HttpClient
	) { }

	ngOnInit(): void {
		this.initForm()
		this.getBooks()
	}

	initForm() {
		this.form = this.formBuilder.group(
			{
				title: ['', Validators.required],
				contributor: ['', Validators.required],
				publisher: ['', Validators.required],
				type_document: [''],
				publication_place: [''],
				publication_date: ['', Validators.required],
				multivolume: [false],
				volume: [''],
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
		if (!this.form.value.volume) this.form.value.volume = 0
		if (this.form.value.title && this.form.value.contributor && this.form.value.publisher) {
			this.bookService.addBook(this.form.value)
				.subscribe(res => {
					console.log(res)
					this.getBooks()
				})
		}
		else {
			console.log('error');
			
		}
	}

	getBooks() {
		this.bookService.getBooks().subscribe(res => {
			console.log(res);
			this.books = res
			this.pageSlice = this.books.slice(0,10)
		})
	}


	onPageChange(event: PageEvent){
		const startIndex = event.pageIndex * event.pageSize
		let endIndex = startIndex + event.pageSize
		if (endIndex > this.books.length){
			endIndex = this.books.length
		}
		this.pageSlice = this.books.slice(startIndex,endIndex)
	}

	showItem(id){
		console.log(id);
		
	}

	deleteBook(id){
		this.book_id = id
		console.log(this.book_id);
		this.onDelete = true
	}

	cancelDelete(){
		this.onDelete = false
	}

	confirmDelete(){
		this.onDelete = false
		this.bookService.deleteBook(this.book_id).subscribe(res => this.getBooks())
	}

}
