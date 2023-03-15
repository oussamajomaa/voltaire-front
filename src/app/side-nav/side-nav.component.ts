import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  role:string
  email:string
  constructor(public authService:AuthService){}

  ngOnInit(): void {
    this.role = localStorage.getItem('role')
    this.email = localStorage.getItem('email')    
  }

}
