import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  email: string;
  password: string;
  displayName: string;
  errorMsg: string;


  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private authSvc: AuthService) { }

  ngOnInit() {
  }

  signUp(){

    this.authSvc.signUp(this.email, this.password, this.displayName)
      .then(resolve => {
        this.router.navigate(['chat']);
        
      }, (err) => {
        this.errorMsg = err.message;
      })
      .catch(error => {
        this.errorMsg = error.message;
      });
  }

}
