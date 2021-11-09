import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../services/book.service';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';





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
	onUpdate = false

	pageSlice:any = []
	pageEvent: PageEvent;

	role:string
	book:any = {}
	multivolume:any
	onMultivolume = false
	constructor(
		private formBuilder: FormBuilder,
		private bookService: BookService,
		private http: HttpClient,
		private router:Router,
		private toastService: ToastrService,

	) {
		this.role = localStorage.getItem('role')
	 }

	ngOnInit(): void {
		
		this.getBooks()
	}

	getBooks() {
		this.bookService.getBooks().subscribe(res => {
			this.books = res
			console.log(this.books);
			
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
		this.router.navigate(['show-item'],{queryParams:{id:id}})
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
		this.bookService.deleteBook(this.book_id).subscribe((res:any) => {
			this.getBooks()
			this.toastService.warning(res.message);
		})
	}

	updateItem(id){
		this.router.navigate(['edit-item'],{queryParams:{id:id}})
	}



}
