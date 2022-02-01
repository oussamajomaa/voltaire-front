import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	form: any = FormGroup
	users: any = []
	displayedColumns: string[] = ['Email', 'Rôle', 'Actions'];
	onAddUser = false
	onDelete = false
	onUpdate = false
	user_id: number
	email:string
	role: string
	currentUser:string

	
	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private toastService: ToastrService,
	) { 
		
	}

	ngOnInit(): void {
		this.currentUser = localStorage.getItem('email')		
		this.initForm()
		this.getUser()
	}

	initForm() {
		this.form = this.formBuilder.group(
			{
				email: [''],
				password: [''],
				role: [''],
			}
		)
	}

	submit() {
		const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (this.form.value.email && 
			this.form.value.password && 
			this.form.value.role &&
			this.form.value.email.match(validRegex)) {
			this.authService.register(this.form.value)
				.subscribe((res:any) => {
					if (res.status ==='200'){
						this.onAddUser = false
						this.toastService.success(res.message);
						this.getUser()
						this.form.reset()
					}
					if (res.status ==='409'){
						this.onAddUser = false
						this.toastService.error(res.message);
						this.getUser()
					}
					
				})			
		}

	}

	cancelAddUser(){
		this.onAddUser = false
	}

	getUser() {
		this.authService.getUsers().subscribe(res => this.users = res)
	}

	deleteUser(id) {
		this.user_id = id
		this.onDelete = true
	}

	confirmDelete() {
		this.authService.deleteUser(this.user_id).subscribe((res:any) => {
			this.toastService.warning(res.message);
			this.getUser()
			this.onDelete = false
		})
	}

	cancelDelete() {
		this.onDelete = false
	}

	addUser() {
		this.onAddUser = true
	}

	updateUser(id,email) {
		this.user_id = id
		this.email = email		
		this.onUpdate = true
	}

	confirmUpdate() {
		if (this.role)
			this.authService.updateUser(this.role, this.user_id).subscribe((res:any) => {
			this.getUser()
			this.email = ''
			this.toastService.success(res.message);
		})
		this.onUpdate = false
	}

	cancelUpdate(){		
		this.onUpdate = false
	}

}
