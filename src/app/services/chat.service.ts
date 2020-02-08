import { Injectable } from '@angular/core';
// import {AngularFireDatabase, FirebaseListObservable}   from '@angular/fire/database-deprecated';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import { ChatMessage } from '../models/chat-message.model';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import {map} from 'rxjs/operators';
import * as fb from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user: fb.User;
  chatMessages: AngularFireList<any[]>;
  chatMessage: ChatMessage;
  userName: Observable<string>;
  userObj : Observable<User>;
  usersObj : Observable<User[]>;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) { 

    
    this.afAuth.authState.subscribe(auth => {
      if(auth !== undefined && auth !== null){
        this.user = auth;
        this.getUser().subscribe( (u: any) => {

          this.userName = u.displayName;
        });
      }
    })
    
    
  }

  fbObjToUser(fbObj) : User{

    return null;
  }


  fblistToUsers(fbList) : User[]{

    return null;
  }

  getUser() {
    const clientId = this.user.uid;
    if(clientId){

      const path = `/users/${clientId}`;
       return this.db.object(path).valueChanges();
    } else{
      console.error("invalid user: " + clientId);
    }
    
  }

  getUsers(){

    const userId = this.user.uid;
    const path = `/users`;
    this.usersObj =  this.db.list(path).snapshotChanges()
        .pipe(map(fbList => this.fblistToUsers(fbList)));
    return this.usersObj;
  }

  getTimeStamp(){
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
            now.getUTCMonth() + '/' +
            now.getUTCDate();
    const time = now.getUTCHours() + ':' +
              now.getUTCMinutes() + ':' +
              now.getUTCSeconds() + ':' +
              now.getUTCMilliseconds() ;
    return (date + ' ' + time + ' ');
  }

  getMessages() {
    //query to create out message feed binding
    this.chatMessages =   this.db.list('/messages');
    return this.chatMessages;
    // return this.chatMessages.snapshotChanges(); // .valueChanges().subscribe();

  }

  sendMessage(msg: string){
    const timeSent = this.getTimeStamp();

    const email = ( this.user && this.user.email) || "a@1.com";
    
    /*
    $key?: string;
    email? : string;
    userName? : string;
    message? : string;
    timeSent? : Date = new Date();
    */

    this.chatMessages.push(<any>{
      message: msg,
      timeSent,
      userName : this.userName || "ab",
      email
    });
    
    console.log('called send message');
  }
}
