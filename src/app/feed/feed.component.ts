import { Component, OnInit, OnChanges } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';
import { AngularFireList } from '@angular/fire/database';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnChanges {
  user: Observable<any>;
  msg: ChatMessage;
  feed$: AngularFireList<ChatMessage[]>;
  msgs : any;


  constructor(private chatService: ChatService) { }

  ngOnInit() {
    // this.feed$ = this.chatService.getMessages();
    const msgsChannel = this.chatService.getMessages();
    debugger;
    if(msgsChannel){
      msgsChannel.subscribe((msgs) => {
      this.msgs = msgs;
      });
    }
  }

  ngOnChanges(){
    this.chatService.getMessages().subscribe((msgs) => {
      this.msgs = msgs;
  });
  }

}
