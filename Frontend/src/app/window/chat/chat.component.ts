import {Component, Input, OnInit} from '@angular/core';
import {Chat} from "../../../models/chat";
import {MessageService} from "../../../services/message.service";
import {Message} from "../../../models/message";
import {User} from "../../../models/user";
import {first} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() chat: Chat | undefined;
  text!: string;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  getUserNamesFromChat(): string {
    return this.chat?.users.map(user => user.name).join(", ") as string;
  }

  sendMessage(text: string): void {
    const id: string = (JSON.parse(localStorage.getItem('user') ?? '') as User).id
    const message: Message = this.createMessage(text, id);
    this.messageService.sendMessage(message)
      .pipe(first())
      .subscribe();
    this.text = "";
    this.saveMessage(message);
  }

  saveMessage(message: Message): void {
    this.chat?.messages.push(message);
    this.saveMessageToChatsInLocalStorage(message);
  }

  saveMessageToChatsInLocalStorage(message: Message): void {
    const chats: Chat[] = this.loadChats();
    chats.find(chat => chat.id == this.chat?.id)?.messages.push(message);
    localStorage.setItem('chats', JSON.stringify(chats));
  }

  loadChats(): Chat[] {
    return JSON.parse(localStorage.getItem("chats") ?? '') as Chat[];
  }

  createMessage(text: string, id: string): Message {
    return {
      text: text,
      senderId: id,
      receiverId: this.chat?.users.map(user => user.id) as [],
      toAllUsers: false,
      timestamp: "2022-03-10T13:04:10.481Z"
    } as Message;
  }

  onKeyDown(): void {
    this.sendMessage(this.text);
  }
  getOwnUser() : User {
    return (JSON.parse(localStorage.getItem("user") ?? '') as User);
  }
  getUserById(id: string) : User {
    return this.chat?.users?.find(x => x.id === id) as User;
  }
}
