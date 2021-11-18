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

	form: any = FormGroup
	books: any = []
	book_id:number
	onDelete = false
	onUpdate = false

	pageSlice:any = []
	pageEvent: PageEvent;

	role:string
	book:any = {}

	

	yes = "yes"
	savedContributors = []
	contributors = []
	contibutorStatus:string
	translators = []
	authors = []
	selectedTranslators = []
	selectedAuthors = []
	onAdd = false

	

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
		// this.getVoltaire()
	}

	getBooks() {
		this.bookService.getBooks().subscribe(res => {
			this.books = res
			console.log(this.books);
			
			this.pageSlice = this.books.slice(0,50)
		})
	}
	pageSize=50
	onPageChange(event: PageEvent){
		console.log(event.pageSize);
		this.pageSize = event.pageSize
		console.log(event.pageIndex);
		const startIndex = event.pageIndex * event.pageSize
		let endIndex = startIndex + event.pageSize
		if (endIndex > this.books.length){
			endIndex = this.books.length
		}
		this.pageSlice = this.books.slice(startIndex,endIndex)
	}

	lastRecord(e){
		console.log(this.pageSize)
		this.pageSlice = this.books.slice(this.books.length-this.pageSize,this.books.length)
	}

	firstRecord(e){
		console.log(this.pageSize)
		this.pageSlice = this.books.slice(0,this.pageSize)
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

	addBook(){
		this.router.navigate(['add-item'])
	}

	// search(e){
	// 	if (e.target.value){
	// 		console.log(e.target.value);
	// 		this.pageSlice = this.books.filter(book => {
	// 			return book.publication_place === e.target.value
	// 		})
	// 	}
	// 	else this.pageSlice = this.books.slice(0,50)
		
	// }
	
	// async getVoltaire(){
		
	// 	let titles = []
	// 	const response = await axios.get('assets/volt.txt')
	// 	titles = response.data.split('|')
	// 	console.log(titles);
	// 		titles.forEach(title => {
	// 			let book = {
	// 				title:title,
	// 				publisher:'',
	// 				publication_place:'',
	// 				publication_date:'',
	// 				publisher_stated:'',
	// 				publication_place_stated:'',
	// 				publication_date_stated:'',
	// 				type_document:'',
	// 				multivolume:'',
	// 				volume:1,
	// 				format:'',
	// 				source:'',
	// 				marginalia:'',
	// 				binding:'',
	// 				library:'',
	// 				cote:'',
	// 				provenance:'',
	// 				ferney:'',
	// 				digital_voltaire:'',
	// 				external_resource:'',
	// 				notes: '',
	// 				user_id:localStorage.getItem('id')
	// 			}
				
	// 			this.bookService.addBook(book).subscribe(res => res)
	// 		})
		
		
	// }

}
