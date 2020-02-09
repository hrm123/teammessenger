import { Component, OnInit, OnChanges } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';
import { AngularFirestoreCollection } from '@angular/fire/firestore';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnChanges {
  user: Observable<any>;
  msg: ChatMessage;
  feed$: AngularFirestoreCollection<ChatMessage>;
  msgs : ChatMessage[] = [];


  constructor(private chatService: ChatService) { 
    
  }
  
  getModelMsgsArray(msgs){
    var that = this;
    
    msgs.forEach(function (msg) {
      let modelMsg: ChatMessage = new ChatMessage();
      modelMsg.$key = msg.$key;
      modelMsg.email = msg.email;
      modelMsg.message = msg.message;
      modelMsg.userName = msg.userName;
      console.log(msg.timeSent);
      modelMsg.timeSent = new Date();
      that.msgs.push(modelMsg);
    });
  }
  

  ngOnInit(){
    this.chatService.getMessages().valueChanges().subscribe(
      feedMsgs => {
        debugger;
        this.getModelMsgsArray(feedMsgs);
      }
    );
  }

  ngOnChanges(){

    this.feed$ = this.chatService.getMessages();

  }

}
