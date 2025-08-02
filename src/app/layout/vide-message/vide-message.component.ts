import {Component, OnInit} from '@angular/core';
import {Chat} from "../../sahred/model/chat/chat";
import {AuthService} from "../../security/serviceAuth/auth.service";
import {ChatService} from "../../sahred/service/chat/chat.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-vide-message',
  templateUrl: './vide-message.component.html',
  styleUrl: './vide-message.component.css'
})
export class VideMessageComponent implements OnInit {

  dataChat: Array<Chat>=new Array<Chat>();
  dataChatRecipient: Array<Chat>=new Array<Chat>();
  dataChatRecipientandsender: Array<Chat>=new Array<Chat>();
  private username: any;

  constructor(private route: ActivatedRoute, protected authService:AuthService , private chatService:ChatService) {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      console.log(this.username);
    });
    this.getAll()
    this.findAllBySenderAndRecipient();

    document.getElementById('action_menu_btn')?.addEventListener('click', () => {
      const actionMenu = document.querySelector('.action_menu');
      if (actionMenu) {
        actionMenu.classList.toggle('active');
      }
    });
  }
  findAllBySenderAndRecipient(){
    this.chatService.getAllBySenderAndRecipient(this.authService.username , this.username).subscribe({
      next:data=>{
        console.log("data:>>")
        console.log(data)
        this.dataChatRecipientandsender=data;
      },
      error:err => {
        console.log(err)
      }
    })
  }
  getAllByrecipient(){
    this.chatService.getALlByRecipient(this.authService.username).subscribe({
      next:data=>{
        this.dataChatRecipient=data;
      },
      error:err => {
        console.log(err)
      }
    })
  }
  getAllBysender(sender:string){
    this.chatService.getAllBySender(sender).subscribe({
      next:data=>{
        this.dataChat=data;
      },
      error:err => {
        console.log(err)
      }
    })
  }

  getAll(){
    this.chatService.getALl().subscribe({
      next:data=>{
        console.log("lwojiedqedjhweio")
        console.log(data)
        this.dataChat=data;
      },
      error:err => {
        console.log(err)
      }
    })
  }

  get item(): Chat {
    return this.chatService.item;
  }

  set item(value: Chat) {
    this.chatService.item = value;
  }

  get items(): Array<Chat> {
    return this.chatService.items;
  }

  set items(value: Array<Chat>) {
    this.chatService.items = value;
  }

  save() {
    this.chatService.save().subscribe({
      next:data=>{
        this.getAll();
        alert("nice")
      },
      error:err => {console.log(err)}
    })
  }

  handelsave() {
    this.item.sender=this.authService.username;
    this.item.date=new Date();
    if(this.authService.roles=='USER'){
      this.item.recipient=this.username;
    }else{
      this.item.recipient="ismail.c"
    }

    this.save()
  }
}
