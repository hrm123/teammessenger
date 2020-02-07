import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked{

  @ViewChild('scroller', {static:false}) private feedScroller: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  scrollToBottom() : void {
    //number of pixel to scroll need to be set
    this.feedScroller.nativeElement.scrollTop = 
        this.feedScroller.nativeElement.scrollHeight; //scrollHeight is the heigh of that div
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

}
