import { Component, OnInit, OnChanges } from '@angular/core';
import { GroupChatService } from '../services/groupchat.service';
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


  constructor(private GroupChatService: GroupChatService) { 
    
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
    this.GroupChatService.getMessages().valueChanges().subscribe(
      feedMsgs => {
        this.getModelMsgsArray(feedMsgs);
      }
    );
  }

  ngOnChanges(){

    this.feed$ = this.GroupChatService.getMessages();

  }

}
