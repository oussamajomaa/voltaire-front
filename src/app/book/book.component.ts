import { HttpClient } from '@angular/common/http';
import { Component, OnInit , AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookService } from '../services/book.service';


@Component({
	selector: 'app-book',
	templateUrl: './book.component.html',
	styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
	@ViewChild('row') row:ElementRef;
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

	rowID:number
	title:string


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
		if (localStorage.getItem('pageSize')) {
			this.pageSize = parseInt(localStorage.getItem('pageSize'))
		}
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
			// récupérer le mot de recherche s'il existe dans le localstorage
			if (localStorage.getItem('search')){
				// assigner la valeur a l'input de recherche
				this.searchForm = this.formBuilder.group(
					{
						title: [localStorage.getItem('search')],
					})
				// récupéere l'id du livre et filtrer la liste des livres
				this.book_id = parseInt(localStorage.getItem('rowID'))
				this.pageSlice = this.books.filter(item => {
					if (item.id === this.book_id)
					return item
				})
				localStorage.removeItem('search')
			}

			if (localStorage.getItem('rowID')){
				
				// hilight le livre édité
				let rowID = localStorage.getItem('rowID')
				let row
				setTimeout(function(){
					row = document.getElementById(rowID)
					if (row){
						row.style.background = '#ff660031'
						row.scrollIntoView();
					}
				},1000)
				localStorage.removeItem('rowID')
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
		localStorage.setItem('rowID', id)
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
		// si l'input de recherche est n'est pas vide, on ajoute sa valeur au localstorage
		if(this.searchForm.value.title){
			localStorage.setItem('search', this.searchForm.value.title)
		}
		// ajouter l'id du livre au localstorage
		localStorage.setItem('rowID', id)
		// ajouter le numéro et le size de la page au localstorage
		localStorage.setItem('pageIndex', this.pageIndex.toString())
		localStorage.setItem('pageSize', this.pageSize.toString())
		// naviguer vers la route 'edit-item'
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
				this.pageSlice = this.books.slice(0,50)
				if (this.pageSlice.length === 0) this.isFounded = false
			})
		}
	}

	clearInput(){
		this.searchForm.reset()
		this.isFounded=true
		this.getBooks()
	}

	// search(event){
		// 	// if(event.target.value.length >2){
		// 		console.log(event.target.value);
		// 		this.bookService.searchBook(event.target.value)
		// 		.subscribe((res:any) => {
		// 			this.books = res
		// 			if (this.books.length > 0)
		// 			this.pageSlice = this.books.slice(0,50)
		// 			else {
		// 				this.pageSlice = []
		// 				this.isFounded = false
		// 			}
		// 			// if (this.pageSlice.length === 0) this.isFounded = false
		// 		})
				
		// 	// }
			
		// }
	
}
