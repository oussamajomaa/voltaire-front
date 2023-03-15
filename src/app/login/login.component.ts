import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	form: any = FormGroup
	hide = true;
	user = {
		email: '',
		password: ''
	}
	email: string
	password: string

	jwt: any
	payload: any
	constructor(
		private authService: AuthService,
		private formBuilder: FormBuilder,
		private router: Router
	) { }

	ngOnInit(): void {
		this.initForm()
	}

	initForm() {
		this.form = this.formBuilder.group(
			{
				email: ['', Validators.required],
				password: ['', Validators.required],
			}
		)
	}

	submit() {
		const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (this.form.value.email && this.form.value.password && this.form.value.email.match(validRegex)) {
			this.authService.login(this.form.value)
		}
	}
}
