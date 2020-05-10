import { Component, OnInit, Pipe } from '@angular/core';
import { SidepanelserviceService } from './sidepanelservice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Constant } from '../../app.constant';
import * as io from 'socket.io-client';
import { timeout } from 'q';
import { Getseleteddata } from '../../app.commonValue';
import { ISubscription } from 'rxjs/Subscription';
// import { Bannneddata } from '../../app.commonValue';
// import { Chatroutering } from '../../app.commonValue';

interface Socketoperator {
  Id: string;
  key: string;
  currentonline1: boolean;
  operator: boolean;
}
@Component({
  selector: 'app-sidepanel',
  templateUrl: './sidepanel.component.html',
  styleUrls: ['./sidepanel.component.css']
})
export class SidepanelComponent implements OnInit {
  socket: SocketIOClient.Socket;
  private applicationModuleSubscription: ISubscription;
  response = [];
  private body = '';
  showLoader = false;
  countofactiveusers: number = 0;
  countofdialogusers: number = 0;
  countofoperators: number = 0;
  activeusersListshow = false;
  currenttabidcss = false;
  currenttabid: string;
  currentonline1 = false;
  userId: string;
  cuurentonlineid: any = [];
  onlinetypinglist: any = [];
  cuurentmsgsfromonlineusercss = false;
  cuurentmsgsfromonlineuser: any = [];
  chatNot = false;
  status: string;
  groupNot = false;
  public role;
  public online;
  key: string;
  evenkey: string;
  private logeduserId: string;
  displayName: string;
  reverse = false;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
  constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private Sidepanelservice: SidepanelserviceService, private getseleteddata: Getseleteddata,) {
    this.socket = io.connect(Constant.url);
  }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.logeduserId = localStorage.getItem('id');
    this.online = localStorage.getItem('online');

    this.socket.on('notificationEmit', (data: any) => {
      if (data.sendr_id == this.logeduserId) {
        this.chatNot = true
      }
    });

    this.socket.on('groupNotificationEmit', (data: any) => {
      if (data.user_id == this.logeduserId) {
        this.groupNot = true
      }
    });
    
    
  }
  

  groupFun(){
    this.groupNot = false 
  }

  chatFun(){
    this.chatNot = false
  }

}
