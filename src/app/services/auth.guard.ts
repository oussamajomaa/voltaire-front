import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(private router: Router,private toastService: ToastrService,) { }
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const token = localStorage.getItem('token');
		const role = localStorage.getItem('role');
		if (token && role === "supervisor") {
			return true;
		}
		else {
			this.toastService.error("You don't have permission !");
			this.router.navigateByUrl('/home')
			return true;
		}
	}
  
}
