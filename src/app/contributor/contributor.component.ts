import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../services/book.service';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';


@Component({
	selector: 'app-contributor',
	templateUrl: './contributor.component.html',
	styleUrls: ['./contributor.component.css']
})
export class ContributorComponent implements OnInit {
	form: any = FormGroup
	searchForm:any = FormGroup
	contributors = []
	onAdd = false
	onDelete = false
	onUpdate = false

	first_name: string
	last_name: string
	type: string
	link_viaf: string
	id:number
	inputSerche:string
	contributor:any

	pageSlice:any = []
	pageEvent: PageEvent;

	allContributors = []

	constructor(
		private formBuilder: FormBuilder,
		private bookService: BookService,
		private toastService: ToastrService,
	) {	}

	ngOnInit(): void {
		this.searchForm = this.formBuilder.group(
			{
				first_name: [''],
			})
		this.getContributor()
		this.initForm()
	}

	initForm() {
		this.form = this.formBuilder.group(
			{
				first_name: ['', Validators.required],
				last_name: [''],
				type: [''],
				link_viaf: ['']
			}
		)
	}

	getContributor() {
		this.bookService.getContributors().subscribe((res: any) => {
			this.contributors = res
			this.allContributors = res
			this.pageSlice = this.contributors.slice(0,7)			
		})
	}

	onPageChange(event: PageEvent){
		const startIndex = event.pageIndex * event.pageSize
		let endIndex = startIndex + event.pageSize
		if (endIndex > this.contributors.length){
			endIndex = this.contributors.length
		}
		this.pageSlice = this.contributors.slice(startIndex,endIndex)
	}

	submit() {
		if (!this.form.value.type) this.form.value.type = ""		
		if (this.form.value.first_name) {
			this.bookService.addContributor(this.form.value)
				.subscribe((res: any) => {
					this.onAdd = false
					this.toastService.success(res.message);
					this.getContributor()
					this.form.reset()
				})
		}
	}

	updateContributor(contributor) {
		this.id = contributor.id
		this.first_name = contributor.first_name
		this.last_name = contributor.last_name
		this.type = contributor.type
		this.link_viaf = contributor.link_viaf
		this.onUpdate = true
	}

	deleteContributor(id) {
		this.id = id
		this.onDelete = true
	}

	addContributor() {
		this.initForm()
		this.onAdd = true
	}

	cancelAddContributor() {
		this.onAdd = false
	}

	confirmDelete() {
		this.bookService.deleteContributor(this.id).subscribe((res:any) => {
			this.toastService.warning(res.message);
			this.getContributor()
		})
		this.onDelete = false
	}

	cancelDelete() {
		this.onDelete = false
	}

	confirmUpdate() {
		if (!this.type) this.type = ""
		this.contributor = {
			first_name:this.first_name,
			last_name:this.last_name,
			type:this.type,
			link_viaf:this.link_viaf,
			id:this.id
		}		
		this.bookService.updateContributor(this.contributor).subscribe((res:any) => {
			this.toastService.warning(res.message);
			this.getContributor()
		})
		
		this.onUpdate = false
	}

	cancelUpdate() {
		this.onUpdate = false
	}


	findContributor(){
		this.bookService.searchContributor(this.searchForm.value.first_name)
		.subscribe((res:any) => {
			this.contributors = res
			this.pageSlice = this.contributors.slice(0,7)
		})
	}

	clearInput(){
		this.searchForm.reset()
		this.getContributor()
	}

}
