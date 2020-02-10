import { Component, OnInit, Input } from '@angular/core';
import { GroupChatService } from '../services/groupchat.service';
import { AuthService } from '../services/auth.service';
import { ChatMessage } from '../models/chat-message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() chatMessage: ChatMessage;

  useremail : string;
  userName: string;
  messageData : string;
  timeStamp : Date;
  isOwnMessage: boolean;

  constructor(private GroupChatService : GroupChatService,
      private authService: AuthService) { }

  ngOnInit(chatMessage = this.chatMessage) {
    this.messageData = chatMessage.message;
    this.timeStamp = chatMessage.timeSent;
    this.userName = chatMessage.userName;
    this.useremail = chatMessage.email;
  }

}
