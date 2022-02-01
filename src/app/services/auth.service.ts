import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Injectable({
	providedIn: 'root'
})
export class AuthService {
	authState = new BehaviorSubject(false);
	token: string
	role: string
	constructor(private http: HttpClient, private router: Router,private toastService: ToastrService,) {
		this.token = localStorage.getItem('token')
		if (this.token) {
		  this.authState.next(true)
		  this.role = localStorage.getItem('role')
		}
	}

	login(user) {
		return this.http.post(`${environment.url}/login`, user)
		.subscribe((res:any) => {			
			if (res.token) {
				localStorage.setItem('token', res['token']);
				const payload = jwt_decode(res['token'])
				this.authState.next(true)
				localStorage.setItem('role', payload['role']);
				localStorage.setItem('email', payload['email']);
				localStorage.setItem('id', payload['id']);
				this.router.navigate(['home'])
				this.toastService.success(res.message);
			}
			else this.toastService.error(res.message);
		})
	}

	logout() {
		localStorage.removeItem('id');
		localStorage.removeItem('token');
		localStorage.removeItem('role');
		localStorage.removeItem('email');
		this.authState.next(false)
	}

	isAuthenticated() {
		return this.authState.value
	}

	register(user){		
		return this.http.post(`${environment.url}/register`,user)
	}

	getUsers(){
		return this.http.get(`${environment.url}/users`)
	}

	deleteUser(id){
		return this.http.delete(`${environment.url}/deleteUser`,{params:{id:id}})
	}

	updateUser(role,id){
		return this.http.patch(`${environment.url}/updateUser`,{role:role},{params:{id:id}})
	}
}
