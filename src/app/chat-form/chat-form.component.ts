import { Component, OnInit } from '@angular/core';
import { GroupChatService } from '../services/groupchat.service';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css']
})
export class ChatFormComponent implements OnInit {

  message: string;
  constructor(private GroupChatService : GroupChatService) { }

  ngOnInit() {
  }

  send(){
    this.GroupChatService.sendMessage(this.message);
    this.message = '';
  }

  handleSubmit(event){
    if(event.keyCode === 13){ //enter key
      this.send();
    }
  }

}
