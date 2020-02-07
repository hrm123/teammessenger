import { Component, OnInit } from '@angular/core';
import * as fb from 'firebase/app';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: Observable<fb.User>;
  userEmail : string;
  uid : string;

  constructor(private authSvc: AuthService ) { }

  ngOnInit() {
    this.user = this.authSvc.authUser();
    this.user.subscribe( user =>{
      debugger;
      if(user){
        this.userEmail = user.email;
        this.uid = user.uid;
      }
    });
  }

  
  signout() {
    this.authSvc.signout();
  }
}
