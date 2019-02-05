import { Component } from "@angular/core";
import { NavController } from "ionic-angular";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  nickname: string = "";
  constructor(public navCtrl: NavController) {}

  joinChat(chat) {
    console.log(this.nickname);
    this.navCtrl.push("ChatRoomPage", { nickname: this.nickname, chat: chat });
  }
}
