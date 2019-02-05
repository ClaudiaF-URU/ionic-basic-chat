import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { Socket } from "ng-socket-io";
import { Observable } from "rxjs/Observable";

/**
 * Generated class for the ChatRoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-chat-room",
  templateUrl: "chat-room.html"
})
export class ChatRoomPage {
  messages = [];
  nickname = "";
  chat = "";
  message = "";
  msgConn;
  usersConn;
  users = [];
  colors = ["primary", "secondary", "danger", "light", "dark"];

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private socket: Socket,
    private toastCtrl: ToastController
  ) {
    this.chat = this.navParams.get("chat");
    this.nickname = this.navParams.get("nickname");

    this.msgConn = this.getMessages().subscribe(message => {
      console.log(message);
      this.messages.push(message);
    });

    this.usersConn = this.getUsers().subscribe(data => {
      console.log(data);

      this.users = data["users"].map(el => {
        return {
          user: el,
          color: this.colors[Math.floor(Math.random() * 5)]
        };
      });

      let user = data["nickname"];
      if (data["event"] === "left") {
        this.showToast("User left: " + user);
      } else {
        this.showToast("User joined: " + user);
      }
    });
  }

  ionViewWillLeave() {
    console.log("bye");
    this.socket.disconnect();
    this.usersConn.unsubscribe();
    this.msgConn.unsubscribe();
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ionViewDidEnter() {
    this.messages = [];
    this.socket.connect();
    this.socket.emit("open-chat", {
      nickname: this.nickname,
      room: this.chat
    });
  }

  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on("in-chat", data => {
        observer.next(data);
      });
    });
    return observable;
  }

  sendMessage() {
    this.socket.emit("send-msg", { text: this.message });
    this.message = "";
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on("message", data => {
        observer.next(data);
      });
    });
    return observable;
  }
}
