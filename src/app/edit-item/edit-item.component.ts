import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
	form: any = FormGroup
	// MatPaginator Output
	pageEvent: PageEvent;
	multi: any
	id: number



	book: any

	title: string
	publisher:string
	type_document: string
	publication_place: string
	publication_date: string
	multivolume: string
	volume: string
	format: string
	source: string
	marginalia: string
	binding: string
	library: string
	cote: string
	provenance: string
	ferney: string
	digital_voltaire: string
	external_resource: string
	notes: string
	user_id: string
	constructor(
		private formBuilder: FormBuilder,
		private bookService: BookService,
		private router: Router,
		private route: ActivatedRoute,
		private toastService: ToastrService,
	) { }

	ngOnInit(): void {
		this.id = this.route.snapshot.queryParams.id
		this.initForm()
		this.getOneBook()
	}

	initForm() {
		this.form = this.formBuilder.group(
			{
				
				publication_place: [''],
				publication_date: [''],
				multivolume: [''],
				volume: [''],
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
				user_id: [''],
			}
		)
	}

	getOneBook() {
		this.bookService.getOneBook(this.id).subscribe(res => {
			this.book = res[0]
			console.log(this.book);
			this.title = this.book.title
			this.type_document = this.book.type_document
			this.publisher = this.book.publisher
			this.publication_place = this.book.publication_place
			this.publication_date = this.book.publication_date
			this.multivolume = this.book.multivolume
			this.volume = this.book.volume
			this.format = this.book.format
			this.source = this.book.source
			this.marginalia = this.book.marginalia
			this.binding = this.book.binding
			this.library = this.book.library
			this.cote = this.book.cote
			this.provenance = this.book.provenance
			this.ferney = this.book.ferney
			this.digital_voltaire = this.book.digital_voltaire
			this.external_resource = this.book.external_resource
			this.notes = this.book.notes



		})
	}

	submit() {
		console.log(this.form.value);
		this.form.value.multivolume = this.multivolume
		if (this.form.value.title && this.form.value.contributor) {
			this.form.value.user_id = localStorage.getItem('id')
			this.bookService.updateBook(this.form.value)
				.subscribe((res: any) => {
					this.toastService.success(res.message);
					this.router.navigateByUrl('home')
				})
			this.form.reset()
		}
		else {
			this.toastService.error("Please enter the required fields !!");
		}
	}

	onMultivolumeClick(event) {

		if (event.target.value === '0') {

			this.form.value.volume = 1
		}
	}

	cancelUpdate() {
		this.router.navigateByUrl('home')
	}
}
