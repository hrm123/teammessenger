import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
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
  chatMessagesRef: AngularFirestoreCollection<ChatMessage>;;
  chattersRef: AngularFirestoreCollection<User>;;
  chatMessage: ChatMessage;
  userName: Observable<string>;
  userObj : Observable<User>;
  usersObj : Observable<User[]>;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { 

    
    this.afAuth.authState.subscribe(auth => {
      if(auth !== undefined && auth !== null){
        this.user = auth;
        this.getUsers();
        this.getUser(null).subscribe( (u: any) => {

          if(u){
            this.userName = u.displayName;
          }
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

  getUser(userId) {
    const clientId = userId || this.user.uid;
    if(clientId){

      // const path = `/users/${clientId}`;
       return this.chattersRef.doc(clientId).valueChanges();
    } else{
      console.error("invalid user: " + clientId);
    }
    
  }

  updateUser(userId, fields){
    const clientId = userId || this.user.uid;
    if(clientId){

      // const path = `/users/${clientId}`;
       return this.chattersRef.doc(clientId).set(fields, {merge: true});
    } else{
      console.error("invalid user: " + clientId);
    }
  }

  getUsers(){

    const userId = this.user.uid;
    const path = `/chatters`;
    this.chattersRef =  this.afs.collection(path);
    //.snapshotChanges()
        // .pipe(map(fbList => this.fblistToUsers(fbList)));
    return this.chattersRef;
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
    this.chatMessagesRef =   this.afs.collection('/messages');
    return this.chatMessagesRef;
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

    this.chatMessagesRef.add(<any>{
      message: msg,
      timeSent,
      userName : this.userName || "ab",
      email
    });
    
    console.log('called send message');
  }
}
