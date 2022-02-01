import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import axios from 'axios';
import { BookService } from '../services/book.service';


@Component({
	selector: 'app-book',
	templateUrl: './book.component.html',
	styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

	searchForm: any = FormGroup
	books: any = []
	book_id: number
	onDelete = false
	onUpdate = false

	pageSlice: any = []
	pageEvent: PageEvent;
	localPageIndex: number = 0
	pageIndex: number = 0
	pageSize: number = 50
	role: string
	book: any = {}

	inputSerche:string

	yes = "yes"
	savedContributors = []
	contributors = []
	contibutorStatus: string
	translators = []
	authors = []
	selectedTranslators = []
	selectedAuthors = []
	onAdd = false
	isFounded=true


	constructor(
		private formBuilder: FormBuilder,
		private bookService: BookService,
		private http: HttpClient,
		private router: Router,
		private toastService: ToastrService,

	) {
		this.role = localStorage.getItem('role')
	}

	ngOnInit(): void {
		this.searchForm = this.formBuilder.group(
			{
				title: [''],
			})

		this.getBooks()
		if (localStorage.getItem('pageIndex')) {
			this.pageIndex = parseInt(localStorage.getItem('pageIndex'))
			this.localPageIndex = parseInt(localStorage.getItem('pageIndex'))
		}
		localStorage.removeItem('pageIndex')
		if (localStorage.getItem('pageSize')) this.pageSize = parseInt(localStorage.getItem('pageSize'))
		localStorage.removeItem('pageSize')
	}

	getBooks() {
		this.bookService.getBooks().subscribe(res => {
			this.books = res
			this.pageSlice = this.books.slice(0, 50)
			if (this.pageIndex > 0) {
				const startIndex = this.pageIndex * this.pageSize

				let endIndex = startIndex + this.pageSize
				
				this.pageSlice = this.books.slice(startIndex, endIndex)

			}

		})
	}

	onPageChange(event: PageEvent) {

		this.pageIndex = event.pageIndex + this.localPageIndex
		this.pageSize = event.pageSize

		let startIndex = this.pageIndex * this.pageSize
		if (startIndex >= this.books.length) {
			this.localPageIndex = 0
			this.pageIndex = 1
			startIndex = this.pageIndex * this.pageSize
		}
		let endIndex = startIndex + this.pageSize
		if (endIndex > this.books.length) {
			endIndex = this.books.length
		}
		this.pageSlice = this.books.slice(startIndex, endIndex)
	}

	lastRecord(e) {
		this.pageSlice = this.books.slice(this.books.length - this.pageSize, this.books.length)
	}

	firstRecord(e) {
		this.pageSlice = this.books.slice(0, this.pageSize)
	}

	showItem(id) {
		localStorage.setItem('pageIndex', this.pageIndex.toString())
		localStorage.setItem('pageSize', this.pageSize.toString())
		this.router.navigate(['show-item'], { queryParams: { id: id } })
	}

	deleteBook(id) {
		this.book_id = id
		this.onDelete = true
	}

	cancelDelete() {
		this.onDelete = false
	}

	confirmDelete() {
		this.onDelete = false
		this.bookService.deleteBook(this.book_id).subscribe((res: any) => {
			this.getBooks()
			this.toastService.warning(res.message);
		})
	}

	updateItem(id) {
		localStorage.setItem('pageIndex', this.pageIndex.toString())
		localStorage.setItem('pageSize', this.pageSize.toString())
		this.router.navigate(['edit-item'], { queryParams: { id: id } })
	}

	addBook() {
		this.router.navigate(['add-item'])
	}

	
	findBook(){
		if(this.searchForm.value.title){
			// this.bookService.searchBook(this.inputSerche)
			this.bookService.searchBook(this.searchForm.value.title)
			.subscribe((res:any) => {
				this.books = res
				this.pageSlice = this.books.slice(0,7)
				if (this.pageSlice.length === 0) this.isFounded = false
			})
		}
	}

	clearInput(){
		this.searchForm.reset()
		this.isFounded=true
		this.getBooks()
	}
	
}
