import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../services/book.service';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  	form: any = FormGroup
	books: any = []
	yes = "yes"
	onMultivolume = false

	pageSlice:any = []
	pageEvent: PageEvent;

	savedContributors = []
	contributors = []

	book_id:number
	contibutorStatus:string

	constructor(
		private formBuilder: FormBuilder,
		private bookService: BookService,
		private toastService: ToastrService,
	) { }

	ngOnInit(): void {
		this.initForm()
		this.getContributor()
	}

	getContributor(){
		this.bookService.getContributors().subscribe((res:any) => this.contributors = res)
	}

	initForm() {
		this.form = this.formBuilder.group(
			{
				title: ['', Validators.required],

				publisher: [''],
				type_document: [''],
				publication_place: [''],
				publication_date: [''],
				multivolume: ['0'],
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

	onMultivolumeClick(event){		
		let value = event.target.value
		if (value === 'yes') this.onMultivolume = true
		if (value === 'no') this.onMultivolume = false	
	}

	submit() {	
		console.log(this.savedContributors);
			
		if (this.form.value.title && this.savedContributors.length != 0) {
		 	this.form.value.user_id=localStorage.getItem('id')
			this.bookService.addBook(this.form.value)
				.subscribe((res:any) => {
					// this.toastService.success(res.message);
					this.book_id = res.book_id
					this.savedContributors.map(id => {
						let item = {
							book_id:this.book_id,
							contributor_id:id
						}
						this.bookService.addBookContributor(item).subscribe((res:any)=>{
						})
						this.toastService.success(res.message);
					})
					
				})
				this.form.reset()
		}
		else {
			this.toastService.error("Please enter the required fields !!");
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
	choosenContributors = []
	slectChange(status){
		console.log(this.contributors);
		console.log(status.value);
		this.getContributor()
		// this.choosenContributors = this.contributors.filter(item => {
		// 	 return item.status === status.value
			 
		// })
		console.log(this.choosenContributors);
	}

}
