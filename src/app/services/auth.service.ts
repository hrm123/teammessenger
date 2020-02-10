import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as fb from 'firebase/app';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import { first, map, filter, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user : Observable<fb.User>;
  private authState : any;
  modelUser : User;
  authUser$ : Observable<User>;
  authUser1 : User;

  constructor(private router: Router,
    private afAuth : AngularFireAuth,
    private afs: AngularFirestore
    ) { 
      this.user = afAuth.authState;
      this.afAuth.authState.subscribe(authUser => {
        if(authUser == null){
          //logged out
          this.authUser$ = of(this.fbObjToUser(authUser));
        } else{
          this.authUser$ = of(this.fbObjToUser(authUser));
        }
      });
      /*
      this.authUser$ = this.afAuth.authState.pipe(switchMap( auth => {
        debugger;
        return of(this.fbObjToUser(auth));
       }));
       */
    }

    private fbObjToUser(fbObj) : User{
      debugger;
      if(fbObj !== null){
      this.authUser1 = new User();
      this.authUser1.email = fbObj.email;
      this.authUser1.uid = fbObj.uid;
      this.authUser1.status = 'online';
      } else{
        if(this.authUser1){
          this.authUser1.status = 'offline';
        }
      }

      return this.authUser1;
    }

    authUser(){
      return this.user;
    }

    isAuthenticated() {
      return this.afAuth.authState.pipe(first())
    }

  get currentUserId() : string {

    return (this.authState !== null && this.authState.user !== null) 
       ?  this.authState.user.uid : '';
  }


  convertToUser(obj){

    this.modelUser = obj;
    
  }

  getUser() {
    if(!this.authState){
      return;
    }
    const clientId = this.authState.user.uid;
    if(clientId){
      // return  this.GroupChatService.getUser(clientId).subscribe( obj => this.convertToUser(obj));
    } else{
      console.error("invalid user: " + clientId);
    }
    
  }

  
  setUserStatus(status){
    const path = `users/${this.currentUserId}`;

    if(!this.authState || !this.authState.user ){

      return Promise.reject("Invalid clientid in setUserStatus method.");;
    }
    const data = {
      status
    };

    // return this.GroupChatService.updateUser(this.currentUserId, data);
  }

  setUserData(email: string, displayName: string, status: string) : void{

    const path = `users/${this.currentUserId}`;

    if(this.authState.user.uid === null){
      return;
    }
    const data = {
      email,
      displayName,
      status
    };

    // this.GroupChatService.updateUser(this.currentUserId, data);
  }


  removeSpecialChars(email : string): string{
    return email.replace('.','dot')
        .replace('#','hash')
        .replace('$','dollar')
        .replace('[','boxstart')
        .replace(']','boxfinish');
  }

  signUp(email: string,password : string, displayName : string){
    const validEmail = this.removeSpecialChars(email);

    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          if(!user){
            return;
          }

          this.getUser();
          // this.usr.email = email;
          // this.usr.password = password;
          // this.usr.username = displayName;
      
          this.authState = user;
          const status = 'online';
          this.setUserData(validEmail, displayName, status);
          // this.GroupChatService.getUsers();
          
        }).catch(err => console.log(err));


    

  }

  

  signout() {
    try{

      this.afAuth.auth.signOut().then( _ =>{
        this.router.navigate(['signon'])
      });
        return;

      /*
      this.afAuth.auth
      // You only want unathenticated states:
        .onAuthStateChanged((user) => {
          if(!user){
            this.router.navigate(['signon']);
          }
        });
        */
      this.setUserStatus('offline').then(res => {

        this.afAuth.auth.signOut().then( _ =>{
          this.router.navigate(['signon']);
        }).catch(err => console.log('signout error : ' + err));



      }).catch(err => {

         console.log(err)
         this.afAuth.auth.signOut().then( _ =>{
          this.router.navigate(['signon']);
        }).catch(err => console.log('signout error : ' + err));
      }
      );
      
    }
    catch(e){

      console.error('signout' + e);
    }

    
    // this.usr.email = '';
    // this.usr.password = '';
    // this.usr.username = '';

    // this.user = null;
    
    
  }
  
  signOn(email: string,password : string){

    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
          this.authState = user;
          const status = 'online';
          // this.setUserData(validEmail, displayName, status);
          this.setUserStatus(status);
          this.getUser();
          // this.usr.email = email;
          // this.usr.password = password;
          // this.usr.username = displayName;

          // this.GroupChatService.getUsers();
          this.router.navigate(['chat']);
        }).catch(err => console.log(err));

  }
}
