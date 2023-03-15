import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

	inputSerche: string

	yes = "yes"
	savedContributors = []
	contributors = []
	contibutorStatus: string
	translators = []
	authors = []
	selectedTranslators = []
	selectedAuthors = []
	onAdd = false
	isFounded = true
	isAdvanced = false

	rowID: number
	title: string

	classifications: any = []

	search_type = "Advanced Search"

	isTitle = true
	isSource = false
	isClassification = false
	isNotes = false
	placeHolder = "title"

	sortTitleA:boolean
	sortTitleD:boolean
	sortSourceA:boolean
	sortSourceD:boolean
	sortNotesA:Boolean
	sortNotesD:Boolean


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
				title: ['']
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
		
		this.bookService.getAllClassification().subscribe(res => {
			this.classifications = res
			// console.log(this.classifications);

			this.bookService.getBooks().subscribe(res => {
				this.books = res
				this.books.map(book => {
					let cl = []
					this.classifications.map(Classification => {
						if (Classification.book_id === book.id) {
							cl.push(Classification)
						}
					})
					book.classifications = cl

				})


				this.pageSlice = this.books.slice(0, 50)
				if (this.pageIndex > 0) {
					const startIndex = this.pageIndex * this.pageSize
					let endIndex = startIndex + this.pageSize
					this.pageSlice = this.books.slice(startIndex, endIndex)
				}
				// récupérer le mot de recherche s'il existe dans le localstorage
				if (localStorage.getItem('search')) {
					// assigner la valeur a l'input de recherche
					this.searchForm = this.formBuilder.group(
						{
							title: [localStorage.getItem('search')],
						})
					// récupéere l'id du livre et filtrer la liste des livres
					// this.book_id = parseInt(localStorage.getItem('rowID'))
					// this.pageSlice = this.books.filter(item => {
					// 	if (item.id === this.book_id)
					// 	return item
					// })
					if (localStorage.getItem('searchType') === "title") {
						
						this.isTitle = true

					}

					if (localStorage.getItem('searchType') === "source") {
						this.isClassification = false
						this.isTitle = false
						this.isSource = true
						this.placeHolder = "source"
					}
					
					if (localStorage.getItem('searchType') === "classification") {
						this.isClassification = true
						this.isTitle = false
						this.isSource = false
						this.placeHolder = "classification"
						
					}
					this.findBook()
					localStorage.removeItem('search')
					localStorage.removeItem('searchType')
				}

				if (localStorage.getItem('rowID')) {

					// hilight le livre édité
					let rowID = localStorage.getItem('rowID')
					let row
					setTimeout(function () {
						row = document.getElementById(rowID)
						if (row) {
							row.style.background = '#ff660031'
							row.scrollIntoView();
						}
					}, 1000)
					localStorage.removeItem('rowID')
				}
			})
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
		// si l'input de recherche est n'est pas vide, on ajoute sa valeur au localstorage
		if (this.searchForm.value.title) {
			localStorage.setItem('search', this.searchForm.value.title)
			if (this.isTitle) localStorage.setItem('searchType', 'title')
			if (this.isClassification) localStorage.setItem('searchType', 'classification')
			if (this.isSource) localStorage.setItem('searchType', 'source')
		}
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
		if (this.searchForm.value.title) {
			localStorage.setItem('search', this.searchForm.value.title)
			if (this.isTitle) localStorage.setItem('searchType', 'title')
			if (this.isClassification) localStorage.setItem('searchType', 'classification')
			if (this.isSource) localStorage.setItem('searchType', 'source')
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


	findBook() {
		if (this.isTitle) this.searchTitle()

		if (this.isSource) this.searchSource()

		if (this.isClassification) this.searchClassification()

		if (this.isNotes) this.searchNotes()
		


	}

	// Clear input seazrch and reset form and get all books
	clearInput() {
		this.searchForm.reset()
		this.isFounded = true
		this.sortTitleA = false
		this.sortTitleD = false
		this.sortSourceA = false
		this.sortSourceD = false
		this.sortNotesA = false
		this.sortNotesD = false
		this.getBooks()
	}


	// Search book by title
	searchTitle() {
		if (this.searchForm.value.title) {
			this.bookService.searchBook(this.searchForm.value.title)
				.subscribe((res: any) => {
					this.books = res
					this.pageSlice = this.books.slice(0, 50)
					if (this.pageSlice.length === 0) this.isFounded = false
				})
		}
	}


	// Search book by source
	searchSource(){
		if (this.searchForm.value.title) {
			this.bookService.searchSource(this.searchForm.value.title)
				.subscribe((res: any) => {
					this.books = res
					this.pageSlice = this.books.slice(0, 50)
					if (this.pageSlice.length === 0) this.isFounded = false
				})
		}
	}

	// Search book by classification
	searchClassification() {
		if (this.searchForm.value.title) {
			console.log(this.searchForm.value.title.toLowerCase())
			let newBooks = []
			this.books.map(book => {
				if (book.classifications.find(x => x.description.toLowerCase() === (this.searchForm.value.title).toLowerCase())) {
					newBooks.push(book)
				}
			
			})
			this.books = newBooks
			this.pageSlice = this.books.slice(0, 50)
			if (this.pageSlice.length === 0) this.isFounded = false
		}
	}

	// Search book by source
	searchNotes(){
		if (this.searchForm.value.title) {
			this.bookService.searchNotes(this.searchForm.value.title)
				.subscribe((res: any) => {
					this.books = res
					this.pageSlice = this.books.slice(0, 50)
					if (this.pageSlice.length === 0) this.isFounded = false
				})
		}
	}

	// Click on radio button to select search book by title
	searchByTitle() {
		this.clearInput()
		this.isTitle = true
		this.isClassification = false
		this.isSource = false
		this.isNotes = false
		this.placeHolder = "title"
	}

	// Click on radio button to select search book by source
	searchBySource() {
		this.clearInput()
		this.isSource = true
		this.isTitle = false
		this.isClassification = false
		this.isNotes = false
		this.placeHolder = "source"
	}

	// Click on radio button to select search book by classification
	searchByClassification() {
		this.clearInput()
		this.isClassification = true
		this.isTitle = false
		this.isSource = false
		this.isNotes = false
		this.placeHolder = "classification"
	}

	searchByNotes() {
		this.clearInput()
		this.isNotes = true
		this.isTitle = false
		this.isSource = false
		this.isClassification = false
		this.placeHolder = "notes"
	}


	// Sort results by title and source :Asc and Desc
	sortTitleAsc(){
		this.books.sort((a,b) => {
			if (a.title > b.title) return 1
			if (a.title < b.title) return -1
			return 0
		})
		this.pageSlice = this.books.slice(0, 50)
		this.sortTitleA = true
		this.sortTitleD = false
		this.sortSourceA = false
		this.sortSourceD = false
		this.sortNotesA = false
		this.sortNotesD = false
	}

	sortTitleDesc(){
		this.books.sort((a,b) => {
			if (a.title > b.title) return -1
			if (a.title < b.title) return 1
			return 0
		})
		this.pageSlice = this.books.slice(0, 50)
		this.sortTitleA = false
		this.sortTitleD = true
		this.sortSourceA = false
		this.sortSourceD = false
		this.sortNotesA = false
		this.sortNotesD = false
	}

	sortSourceAsc(){
		this.books.sort((a,b) => {
			if (a.source > b.source) return 1
			if (a.source < b.source) return -1
			return 0
		})	
		this.pageSlice = this.books.slice(0, 50)
		this.sortTitleA = false
		this.sortTitleD = false
		this.sortSourceA = true
		this.sortSourceD = false
		this.sortNotesA = false
		this.sortNotesD = false
	}

	sortSourceDesc(){
		this.books.sort((a,b) => {
			if (a.source > b.source) return -1
			if (a.source < b.source) return 1
			return 0
		})
		this.pageSlice = this.books.slice(0, 50)
		this.sortTitleA = false
		this.sortTitleD = false
		this.sortSourceA = false
		this.sortSourceD = true
		this.sortNotesA = false
		this.sortNotesD = false
	}

	sortNotesAsc(){
		this.books.sort((a,b) => {
			if (a.notes > b.notes) return 1
			if (a.notes < b.notes) return -1
			return 0
		})	
		this.pageSlice = this.books.slice(0, 50)
		this.sortTitleA = false
		this.sortTitleD = false
		this.sortSourceA = false
		this.sortSourceD = false
		this.sortNotesA = true
		this.sortNotesD = false
	}

	sortNotesDesc(){
		this.books.sort((a,b) => {
			if (a.notes > b.notes) return -1
			if (a.notes < b.notes) return 1
			return 0
		})
		this.pageSlice = this.books.slice(0, 50)
		this.sortTitleA = false
		this.sortTitleD = false
		this.sortSourceA = false
		this.sortSourceD = false
		this.sortNotesA = false
		this.sortNotesD = true
	}

}
