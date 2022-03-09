import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {map, Observable, startWith} from "rxjs";
import {Chat} from "../../models/chat";
import {MatDialog} from "@angular/material/dialog";
import {ChatDialogComponent} from "./chat-dialog/chat-dialog.component";

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {
  username: string | undefined;
  userControl = new FormControl();
  users: User[] = [];
  filteredUsers: Observable<User[]> | undefined;
  openedChat: Chat | undefined;

  chats: Chat[] = [
    {
      id: "1",
      users: [
        {id: "asd", name: "test1"},
        {id: "asd2", name: "test2"},
      ]
    },
    {
      id: "2",
      users: [
        {id: "asd", name: "test3"},
        {id: "asd2", name: "test4"},
      ]
    }
  ];

  constructor(private userService: UserService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.checkIfUserIsLoggedInElseRedirect();
    this.loadUsers();

    this.filteredUsers = this.userControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  checkIfUserIsLoggedInElseRedirect() : void {
    const user = localStorage.getItem('user');

    if (user != undefined) {
      const myUser = JSON.parse(user) as User;
      this.username = myUser.name;
    }else {
      this.router.navigate(['/login'])
    }
  }

  loadUsers() : void {
    this.userService.getUsers().subscribe(res => {
      this.users = res.body as User[];
    });
  }

  _filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => user.name.toLowerCase().includes(filterValue));
  }

  openChat($chatId: string) {
    this.openedChat = this.chats.find(chat => chat.id === $chatId);
  }

  b: string | undefined;

  openDialog(): void {
    const dialogRef = this.dialog.open(ChatDialogComponent, {
      width: '250px',
      data: [
              {id: "asd", name: "test1"},
              {id: "asd2", name: "test2"},
            ]
    });

    dialogRef.afterClosed().subscribe(result => {
      this.b = result;
      console.log(result);
    });
  }
}
