import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signon-form',
  templateUrl: './signon-form.component.html',
  styleUrls: ['./signon-form.component.css']
})
export class SignonFormComponent {
  email: string;
  password: string;
  errorMsg: string;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    console.log('login() called from login-form component');
    this.authService.signOn(this.email, this.password)
    .catch(error => this.errorMsg = error.message);
  }

}
