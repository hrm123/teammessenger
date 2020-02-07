import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
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

  constructor(private chatService : ChatService,
      private authService: AuthService) { }

  ngOnInit(chatMessage = this.chatMessage) {
    this.messageData = chatMessage.message;
    this.timeStamp = chatMessage.timeSent;
    this.userName = chatMessage.userName;
    this.useremail = chatMessage.email;
  }

}
