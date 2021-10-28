import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../services/book.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  form: any = FormGroup
	books: any = []
	yes = "yes"


	pageSlice:any = []
	pageEvent: PageEvent;

	constructor(
		private formBuilder: FormBuilder,
		private bookService: BookService,
	) { }

	ngOnInit(): void {
		this.initForm()
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
				multivolume: ['no',Validators.required],
				volume: ['1'],
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
		if (this.form.value.title && this.form.value.contributor && this.form.value.publisher) {
			this.form.value.user_id=localStorage.getItem('id')
			this.bookService.addBook(this.form.value)
				.subscribe(res => {
					console.log(res)
				})
		}
		else {
			console.log('error');
		}
	}

	
	onPageChange(event: PageEvent){
		const startIndex = event.pageIndex * event.pageSize
		let endIndex = startIndex + event.pageSize
		if (endIndex > this.books.length){
			endIndex = this.books.length
		}
		this.pageSlice = this.books.slice(startIndex,endIndex)
	}

}
