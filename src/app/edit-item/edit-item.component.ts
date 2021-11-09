import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
	selector: 'app-edit-item',
	templateUrl: './edit-item.component.html',
	styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {
	// MatPaginator Output
	pageEvent: PageEvent;
	multi: any
	id: number



	book: any

	// title: string
	// publisher:string
	// type_document: string
	// publication_place: string
	// publication_date: string
	// multivolume: string
	// volume: string
	// format: string
	// source: string
	// marginalia: string
	// binding: string
	// library: string
	// cote: string
	// provenance: string
	// ferney: string
	// digital_voltaire: string
	// external_resource: string
	// notes: string
	// user_id: string

	contributors = []
	selectedContributors = []

	ids = []
	constructor(
		private bookService: BookService,
		private router: Router,
		private route: ActivatedRoute,
		private toastService: ToastrService,
	) { }

	ngOnInit(): void {
		this.id = this.route.snapshot.queryParams.id
		this.getOneBook()
		this.getCntributors()
		this.getBokkContributor()
		console.log(new Date().toLocaleString().slice(0,10));
	}

	

	getOneBook() {
		this.bookService.getOneBook(this.id).subscribe(res => {
			this.book = res[0]
			console.log(this.book);
			// this.title = this.book.title
			// this.type_document = this.book.type_document
			// this.publisher = this.book.publisher
			// this.publication_place = this.book.publication_place
			// this.publication_date = this.book.publication_date
			// this.multivolume = this.book.multivolume
			// this.volume = this.book.volume
			// this.format = this.book.format
			// this.source = this.book.source
			// this.marginalia = this.book.marginalia
			// this.binding = this.book.binding
			// this.library = this.book.library
			// this.cote = this.book.cote
			// this.provenance = this.book.provenance
			// this.ferney = this.book.ferney
			// this.digital_voltaire = this.book.digital_voltaire
			// this.external_resource = this.book.external_resource
			// this.notes = this.book.notes



		})
	}

	submit() {
		this.ids = []
		let array = []
		this.selectedContributors.map(name => {			
			array.push(this.contributors.filter(contributor => contributor.name === name ))
		})
		array.map(item => this.ids.push(item[0].id))
		// console.log(this.ids);
		
		
		console.log(this.book);
		
		if (this.book.title) {
			this.book.user_update = localStorage.getItem('id')
			this.book.update_date = new Date().toLocaleString().slice(0,10)
			this.bookService.updateBook(this.book)
				.subscribe((res: any) => {
					this.toastService.success(res.message);
					this.router.navigateByUrl('home')
				})
		}
		else {
			this.toastService.error("Please enter the required fields !!");
		}
	}

	getBokkContributor(){
		let array = []
		this.bookService.getBookContributor(this.id)
		.subscribe((res:any) => {
			array = res
			console.log(array);
			this.selectedContributors = array.map(item => {
				return item.name
			})
			console.log(this.selectedContributors);
		})
	}

	getCntributors(){
		this.bookService.getContributors()
		.subscribe((res:any) => {
			this.contributors = res
			console.log(this.contributors);
			
		})
	}

	valuechange(event){
		this.book.title = (event.target.value);
		
	}

	onMultivolumeClick(event) {

		
	}

	cancelUpdate() {
		this.router.navigateByUrl('home')
	}
}
