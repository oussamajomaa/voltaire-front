import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
	selector: 'app-show-item',
	templateUrl: './show-item.component.html',
	styleUrls: ['./show-item.component.css']
})
export class ShowItemComponent implements OnInit {
	id: number
	book:any
	contributors = []

	constructor(
		private bookService: BookService,
		private router: Router,
		private route: ActivatedRoute,
	) { }

	ngOnInit(): void {
		this.id = this.route.snapshot.queryParams.id
		this.getOneBook()
		this.getBookContributor()
	}

	getOneBook() {
		this.bookService.getOneBook(this.id).subscribe(res => {
			this.book = res[0]
			console.log(this.book);
		})
	}

	getBookContributor(){
		this.bookService.getBookContributor(this.id)
		.subscribe((res:any) => this.contributors = res)
	}

	retunToHome(){
		this.router.navigateByUrl('book')
	}

}
