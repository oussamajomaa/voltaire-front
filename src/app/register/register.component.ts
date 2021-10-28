import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

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
	role: string
	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService
	) { }

	ngOnInit(): void {
		this.initForm()
		this.getUser()
	}

	initForm() {
		this.form = this.formBuilder.group(
			{
				email: ['', Validators.required],
				password: ['', Validators.required],
				role: ['', Validators.required],
			}
		)
	}

	submit() {
		const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (this.form.value.email && this.form.value.password && this.form.value.email.match(validRegex)) {
			this.authService.register(this.form.value)
				.subscribe(res => {
					console.log(res)
					this.getUser()
					this.onAddUser = false
				})
		}

	}

	getUser() {
		this.authService.getUsers().subscribe(res => this.users = res)
	}

	deleteUser(id) {
		this.user_id = id
		console.log(this.user_id);
		this.onDelete = true
	}

	confirmDelete() {
		this.authService.deleteUser(this.user_id).subscribe(res => {
			console.log(res)
			this.getUser()
		})
	}

	cancelDelete() {
		this.onDelete = false
	}

	addUser() {
		this.onAddUser = true
	}

	updateUser(id) {
		this.user_id = id
		console.log(this.user_id);
		
		this.onUpdate = true
	}

	confirmUpdate() {
		if (this.role)
			this.authService.updateUser(this.role, this.user_id).subscribe(res => {
			this.getUser()
		})
		this.onUpdate = false
		console.log(this.role);
	}

	cancelUpdate(){
		console.log(this.role);
		
		this.onUpdate = false
	}

}
