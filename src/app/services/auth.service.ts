import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as fb from 'firebase/app';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import { first, map, filter } from 'rxjs/operators';
import { ChatService } from './chat.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user : Observable<fb.User>;
  private authState : any;
  modelUser : User;
  
  constructor(private router: Router,
    private afAuth : AngularFireAuth,
    private afs: AngularFirestore,
    private chatService : ChatService
    ) { 
      this.user = afAuth.authState;
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
      return  this.chatService.getUser(clientId).subscribe( obj => this.convertToUser(obj));
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

    return this.chatService.updateUser(this.currentUserId, data);
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

    this.chatService.updateUser(this.currentUserId, data);
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
          this.chatService.getUsers();
          
        }).catch(err => console.log(err));


    

  }

  

  signout() {
    try{

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

          this.chatService.getUsers();
          this.router.navigate(['chat']);
        }).catch(err => console.log(err));

  }
}
