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
        debugger;
        this.router.navigate(['chat']);
        
      }, (err) => {
        debugger;
        this.errorMsg = err.message;
      })
      .catch(error => {
        debugger;
        this.errorMsg = error.message;
      });
  }

}
