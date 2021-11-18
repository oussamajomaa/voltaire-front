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
	contributors = []
	onAdd = false
	onDelete = false
	onUpdate = false

	name: string
	status: string
	id:number

	contributor:any

	pageSlice:any = []
	pageEvent: PageEvent;

	constructor(
		private formBuilder: FormBuilder,
		private bookService: BookService,
		private toastService: ToastrService,
	) { }

	ngOnInit(): void {
		this.getContributor()
		this.initForm()
	}

	initForm() {
		this.form = this.formBuilder.group(
			{
				name: ['', Validators.required],
				status: ['', Validators.required],
			}
		)
	}

	getContributor() {
		this.bookService.getContributors().subscribe((res: any) => {
			this.contributors = res
			console.log(this.contributors);
			
			this.pageSlice = this.contributors.slice(0,7)
			console.log(this.pageSlice);
			
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
		if (this.form.value.name && this.form.value.status) {
			this.bookService.addContributor(this.form.value)
				.subscribe((res: any) => {
					this.onAdd = false
					this.toastService.success(res.message);
					this.getContributor()
					this.form.reset()
				})
		}
	}

	updateContributor(id,name,status) {
		this.id = id
		this.name = name
		this.status = status
		this.onUpdate = true
	}

	deleteContributor(id) {
		this.id = id
		this.onDelete = true
	}

	addContributor() {
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
		this.contributor = {
			name:this.name,
			status:this.status,
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

}
