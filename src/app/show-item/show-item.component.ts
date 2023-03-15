import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';

import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';



@Component({
	selector: 'app-show-item',
	templateUrl: './show-item.component.html',
	styleUrls: ['./show-item.component.css']
})
export class ShowItemComponent implements OnInit {


	id: number
	book:any
	contributors = []
	classifications = []
	digitals = []

	constructor(
		private bookService: BookService,
		private router: Router,
		private route: ActivatedRoute,
		private domSanitizer: DomSanitizer,
		private location: Location
	) { }

	public transform(value: any, prefix = '') {
    	return this.domSanitizer.bypassSecurityTrustUrl(prefix + value);
  	}
	ngOnInit(): void {
		this.id = this.route.snapshot.queryParams.id
		this.bookService.getClassification(this.id).subscribe((res:any) => {
			this.classifications = res
		})
		this.getOneBook()
		this.getBookContributor()
	}

	getOneBook() {
		this.bookService.getOneBook(this.id).subscribe(res => {
			this.book = res[0]
			if (this.book.digital_voltaire)
				this.digitals = this.book.digital_voltaire.split(',')
			
		})
	}

	getBookContributor(){
		this.bookService.getBookContributor(this.id)
		.subscribe((res:any) => {
			this.contributors = res
			this.contributors.sort((a,b)=>{
				if (a.status > b.status) return 1
				if (a.status < b.status) return -1
				return 0
			})
			
		})
	}

	retunToHome(){
		this.router.navigateByUrl('book')
	}

}
