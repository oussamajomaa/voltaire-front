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
	book_id: number

	translators = []
	authors = []
	selectedTranslators = []
	selectedAuthors = []

	book: any

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
		this.book_id = this.route.snapshot.queryParams.id
		this.getOneBook()
		this.getContributors()
		this.getBokkContributor()
		console.log(new Date().toLocaleString().slice(0, 10));
	}



	getOneBook() {
		this.bookService.getOneBook(this.book_id).subscribe(res => {
			this.book = res[0]
			console.log(this.book);
		})
	}

	submit() {
		this.ids = []
		let array = []
		this.selectedContributors = this.selectedAuthors.concat(this.selectedTranslators)
		this.selectedContributors.map(name => {
			array.push(this.contributors.filter(contributor => contributor.name === name))
		})
		array.map(item => this.ids.push(item[0].id))
		// console.log(this.ids);


		console.log(this.book);
		if (this.book.multivolume === "") this.book.multivolume = "no"
		if (this.book.multivolume === "no") this.book.volume = 1
		if (this.book.title) {
			this.book.user_update = localStorage.getItem('id')
			this.book.update_date = new Date().toLocaleString().slice(0, 10)
			this.bookService.updateBook(this.book)
				.subscribe((res: any) => {
					// this.toastService.success(res.message);
					this.ids.map(id => {
						let item = {
							book_id: this.book_id,
							contributor_id: id
						}
						this.bookService.addBookContributor(item).subscribe((res: any) => {
						})
					})
					this.toastService.success(res.message);
					this.router.navigateByUrl('book')
				})

		}
		else {
			this.toastService.error("Please enter the required fields !!");
		}
	}

	getBokkContributor() {
		let array1 = []
		let array2 = []
		console.log(this.book_id);
		
		this.bookService.getBookContributor(this.book_id)
			.subscribe((res: any) => {
				array1 = res.filter(item => item.status ==='author')
				array2 = res.filter(item => item.status ==='translator')
				console.log('res',res);
				this.selectedAuthors = array1.map(item => {
					return item.name
				})
				this.selectedTranslators = array2.map(item => {
					return item.name
				})
			})
	}

	getContributors() {
		this.bookService.getContributors()
			.subscribe((res: any) => {
				this.contributors = res
				this.authors = res.filter(item => item.status === 'author')
				this.translators = res.filter(item => item.status === 'translator')
				console.log('this.authors',this.authors);
				console.log('this.translators',this.translators);
				console.log('this.contributors',this.contributors);

			})
	}

	valuechange(event) {
		this.book.title = (event.target.value);

	}

	cancelUpdate() {
		this.router.navigateByUrl('book')
	}
}
