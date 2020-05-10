import { Component, OnInit, OnChanges, Pipe, EventEmitter, Output } from '@angular/core';
import { AllchatserviceService } from './allchatservice.service';
import { SidepanelserviceService } from '../sidepanel/sidepanelservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';
import { Constant } from '../../app.constant';
import { ISubscription } from 'rxjs/Subscription';
import { Getseleteddata } from '../../app.commonValue';
import { Chatroutering } from '../../app.commonValue';
import * as io from 'socket.io-client';
import * as _ from 'underscore';
import { timeout } from 'q';
declare var jQuery: any;

interface Socketoperator {
  Id: string;
  key: string;
}
@Component({
  selector: 'app-allchats',
  templateUrl: './allchats.component.html',
  styleUrls: ['./allchats.component.css']
})
export class AllchatsComponent implements OnInit {

  @Output() serverCreated = new EventEmitter<{ ActiveDisplayName: string }>();
  socket: SocketIOClient.Socket;
  private applicationModuleSubscription1: ISubscription;
  response = [];
  private body = '';
  public disabled: boolean;
  disconnecte = false;
  disconnected = false;
  showLoader = false;
  istyping = true;
  typebox = true;
  typebox1 = false;
  status: string;
  currenttabidcss = false;
  currenttabidcss1 = false;
  currenttabid: string;
  public chathistory: any = [];
  private istypingusers: any = [];
  public userbrowsing: any = [];
  public usersList: any = [];
  private array: any = [];
  public usernamekey: any = {};
  public companyList: any = [];
  public selectedcompany: any = {};
  public anotherRecrList :any=[];
  msgcount: number = 0;
  key: string;
  start_index: number;
  private userId: string;
  private userparamsId: string;
  private logeduserId: string;
  private logeduserId1: string;
  public currentDate: any;
  public previous: any;
  public curnttDate: String;
  public role;
  reverse = false;
  messageText: string;
  images = {};
  showpreview = false;
  msgInfo;
  public Category = {
    image: ''
  }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
  constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private AllchatserviceService1: AllchatserviceService,
    private Sidepanelservice: SidepanelserviceService,
    private getseleteddata: Getseleteddata,
    private chatroutering: Chatroutering) {
    this.socket = io.connect(Constant.url);

  }

  async ngOnInit() {
    this.disabled = true;
    document.title = 'Chat History';
    this.showLoader = true;
    this.disconnecte = false;
    this.disconnected = false;
    this.typebox = true;
    this.userId = this.route.snapshot.params['id']
    this.userparamsId = this.route.snapshot.params['id']
    // this.userId = localStorage.getItem('id')
    this.logeduserId = localStorage.getItem('id')
    this.role = localStorage.getItem('role');
    this.userId;
    this.getusercompanies();
   
    let presenturl = this.userId;
    this.router.events.subscribe((event) => {
      this.userId = this.route.snapshot.params['id'];
      if (presenturl !== this.userId) {
        presenturl = this.userId;
        this.customertypinginit();
        this.typebox = true;
        this.typebox1 = false;
      }
    });


    this.socket.on('EmitMessageTorecevr', (msg: any) => {
      this.chathistory.push(msg);
      this.msgcount = this.chathistory.length
      this.oneToOneChat();
    });

    this.socket.on('notificationEmit', (data: any) => {
      let userArr = []
      this.usersList.forEach(element => {
        if ((element._id == data.recer_id) && this.userId != data.recer_id) {
          this.AllchatserviceService1.sndrRecrMsgCuntInfo(this.logeduserId, element._id).then(async obj => {
            element.notification_count = (obj.result.length == 0 ? 0 : obj.result[0].notification_count)
          })
        }
        userArr.push(element)
      });
      this.usersList = userArr
      this.usersList = this.usersList.sort((a, b) => b.online - a.online);
    });

    this.socket.on('user Entered In online', (data: any) => {
      let userArr = []
      this.usersList.forEach(element => {
        if (element._id == data._id) {
          element.online = true
        }
        userArr.push(element)
      });
      this.usersList = userArr
      this.usersList = this.usersList.sort((a, b) => b.online - a.online);

    });

    this.socket.on('user Entered off online', (data: any) => {
      let userArr = []
      this.usersList.forEach(element => {
        if (element._id == data) {
          element.online = false
        }
        userArr.push(element)
      });
      this.usersList = userArr
      this.usersList = this.usersList.sort((a, b) => b.online - a.online);

    });

    this.socket.on('userAddedIntoCompanylistEmit', (data: any) => {
      // this.usersList.push(data.result)
      // this.usersList = this.usersList.sort((a, b) => b.online - a.online);
      this.getCompanyUsers1()
    });
    
    
    this.socket.on('deltedUserChtWindownRefreshList', (data: any) => {
      this.getCompanyUsers1()
    });

    this.socket.on('customerTyping', (msg: any) => {
      if (this.istypingusers === null) {
        this.istypingusers = [];
      }
      if (this.istypingusers.indexOf(msg) === -1) {
        this.istypingusers.push(msg);
        localStorage.setItem('istyping', this.istypingusers);
        const type = 'Customer';
        this.customertyping(msg, type);
      }
    });
    this.customertypinginit();

    this.socket.on('customerStopTyping', (msg: any) => {
      const type = 'Customer';
      this.customerStopTyping(msg, type);
      console.log("--------#2---------------")
      this.sectionScrlTop();
    });
  }

  customertyping(key, type) {
    // console.log("===localStorage.getItem('istyping')====", localStorage.getItem('istyping'))
    // if (this.istypingusers === null) {
    //   this.istypingusers = [];
    // }
    if (localStorage.getItem('istyping').indexOf(this.userId) !== -1) {
      // console.log(key, this.userId, '------------');
      this.istyping = false;
    } else {
      // console.log(key, this.userId, '------else------');
      this.istyping = true;
    }
  }
  customertypinginit() {
    //localStorage.getItem('istyping')
    // if (this.istypingusers === null) {
    //   this.istypingusers = [];
    // }
    if (localStorage.getItem('istyping').indexOf(this.userId) !== -1) {
      // console.log(this.userId, '------------');
      this.istyping = false;
    } else {
      // console.log(this.userId, '------else------');
      this.istyping = true;
    }
  }
  //////////-----------end-start typing//////////////////

  //////////------------stop typing//////////////////
  customerStopTyping(key, type) {
    // console.log(key, 'customerStopTyping');
    localStorage.getItem('istyping');
    // this.istypingusers.forEach((obj, key1) => {
    //   console.log('---inx-', key1)
    //   if (obj === key.key) {
    //     this.start_index = key1;
    //   }
    // });
    // console.log("-upper---", this.istypingusers, key.key, localStorage.getItem('istyping'))
    const idx = this.istypingusers.indexOf(key.key);
    // console.log("---------index-", idx)
    if (idx !== -1) {
      this.istypingusers.splice(idx, 1);
    }
    localStorage.setItem('istyping', this.istypingusers);
    // console.log("--123--", this.istypingusers, localStorage.getItem('istyping'), this.array)
    // this.customertypinginit();
  }
  //////////------------end typing//////////////////

  uploadImage(file) {
    if (file.target.files.length > 0) {
      this.Category.image = file.target.files[0];
    }


    if (file.target.files && file.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.images = event.target.result;
        this.showpreview = true;
      };
      reader.readAsDataURL(file.target.files[0]);
    }
  }



  sendmessage(messageText) {
    if (typeof this.messageText !== 'undefined' && this.messageText !== '') {
      localStorage.setItem('chat-key', this.userId);
      this.socket.emit('sendMessage', { messageText: this.messageText, recer_id: this.userId, sndr_id: this.logeduserId, type: 'normal' });
      //   $('.content-wrapper').scrollTop(20);
      //   $('.content-wrapper').animate({
      //     scrollTop: $('.content-wrapper').offset().top
      // }, 1000);
      this.sectionScrlTop();
      this.messageText = '';
      $(".content-wrapper").scroll();
      $('#m').focus();
      let temp = {};
      temp['messages'] = messageText
      temp['recer_id'] = this.userId
      temp['sndr_id'] = this.logeduserId
      temp['type'] = 'normal'
      this.AllchatserviceService1.msgSendToUser({}).then(response => {
        this.oneToOneChat();
      });
    } else {
      const info: FormData = new FormData();
      for (const key in this.Category) {
        if (key === 'image') {
          info.append('image', this.Category[key]);
          info.append('recer_id', this.userId);
          info.append('sndr_id', this.logeduserId);
          info.append('type', 'normal');
        }
      }
      this.sectionScrlTop();
      $(".content-wrapper").scroll();
      $('#m').focus();
      this.AllchatserviceService1.imageSendToUser(info).then(response => {
        this.socket.emit('sendfile', response);
        this.images = '';
        this.showpreview = false;
        this.oneToOneChat();
      });
    }
  }

  valuechange(newValue) {
    if (newValue.length === 1) {
      this.onfocus();
    } else if (newValue.length < 1) {
      this.outfocus();
    }
  }
  // (click)="onfocus(messageText)"
  onfocus() {
    this.socket.emit('OperatorTyping', { key: this.userId });
    // console.log("---------starttyping--------", this.userId)
  }
  outfocus() {
    // console.log("------------stopped-----", this.userId)
    this.socket.emit('OperatorStoppedTyping', { key: this.userId });
  }

  joindata() {
    this.typebox = false;
  }



  sectionScrlTop() {
    const $target = $('.direct-chat-messages');
    $target.animate({ scrollTop: $target[0].scrollHeight }, 500);
  }
  async allUsersList() {
    if (localStorage.getItem('role') == 'ADMIN') {
      await this.AllchatserviceService1.listAllUsers().then(async response => {
        if (response.result.length > 0) {
          this.userId = response.result[0].user_id._id
          await Promise.all(response.result.map(async (element) => {
            this.AllchatserviceService1.sndrRecrMsgCuntInfo(this.logeduserId, element.user_id._id).then(async obj => {
              element.user_id.notification_count = (obj.result.length == 0 ? 0 : obj.result[0].notification_count)
            })
            if (element.user_id._id != this.logeduserId) {
              this.usersList.push(element.user_id)
            }
          }));
          if (this.usersList && this.usersList.length > 0) {
            this.usersList = this.usersList.sort((a, b) => b.online - a.online);
            this.router.navigate(['/allchathistory/' + this.usersList[0]._id]);
            this.selectedUser(this.usersList[0])
          }
        }
      });
    }
  }


  async getCompanyUsers() {
    if (this.companyList.length > 0) {
      await this.AllchatserviceService1.CompanyRelatedUsers(this.companyList[0].company_id._id).then(async user => {
        this.showLoader = false;
        if (user.status == 'success') {
          let data = []
          await Promise.all(user.result.map(async (element) => {
            await this.AllchatserviceService1.sndrRecrMsgCuntInfo(this.logeduserId, element.user_id._id).then(async obj => {
              element.user_id.notification_count = (obj.result.length == 0 ? 0 : obj.result[0].notification_count)
            })

            if (element.user_id._id != localStorage.getItem('id')) {
              data.push(element.user_id)
            }
          }));
          this.usersList = data
          if (this.usersList && this.usersList.length > 0) {
            this.usersList = this.usersList.sort((a, b) => b.online - a.online);
            // this.router.navigate(['/allchathistory/' + this.usersList[0]._id]);
            this.selectedUser(this.usersList[0])
          }        }
      })
    }
  }

  getMsgList(): void {
    this.showLoader = true;
    if (this.userId != undefined) {
      this.AllchatserviceService1.getMessagesList(this.userId).then(response => {
        this.showLoader = false;
        this.msgcount = response.result.length;
        this.chathistory = response.result;
        this.chathistory.forEach(element => {
          element.curnttDate = this.timeSince(element.createdAt)
        });
        this.disabled = false;
        this.anotherRecerList()
      });
    }
  }

  anotherRecerList(){
    if (this.userId != undefined) {
      this.AllchatserviceService1.anotherRecrList(this.userId).then(response => {
        this.anotherRecrList = response.result;
      });
    }
  }

  async ReceiverSelected(user){
    if (this.userId != undefined) {
      this.currenttabidcss1 = true;
      this.logeduserId1 = user._id
    await this.AllchatserviceService1.getMessagesListAdmin(this.userId,user._id).then(async response => {
        this.showLoader = false;
        this.msgcount = response.result.length;
        this.chathistory = response.result;
        this.chathistory.forEach(element => {
          element.curnttDate = this.timeSince(element.createdAt)
        });
      });
    }
  }
  
  oneToOneChat() {
    if (this.userId != undefined) {
      this.AllchatserviceService1.getMessagesList(this.userId).then(response => {
        this.msgcount = response.result.length;
        this.chathistory = response.result;
        this.chathistory.forEach(element => {
          element.curnttDate = this.timeSince(element.createdAt)
        });
      });
    }
  }

  selectedUser(userDetail) {
    setTimeout(()=>{
      this.currenttabidcss = true;
      // this.currenttabid = this.route.snapshot.params['id'];
      // this.userId = this.route.snapshot.params['id']
      this.currenttabid = userDetail._id;
      this.userId = userDetail._id
      this.userparamsId = userDetail._id
      this.anotherRecerList()
      this.currenttabidcss1 = false;
    },200)
    
    // this.AllchatserviceService1.notificationsUpdate(this.logeduserId, userDetail._id).then(userdata => {
    //   let userArr = []
    //   this.usersList.forEach(element => {
    //     if (userdata.result != undefined && element._id == userdata.result.recer_id) {
    //       element.notification_count = 0
    //     }
    //     userArr.push(element)
    //   });
    //   this.usersList = userArr
    //   // this.usersList = this.usersList.sort((a, b) => b.online - a.online);

    // })
  }

  getusercompanies() {
    this.AllchatserviceService1.userRelatedCompany(localStorage.getItem('id')).then(company => {
      if (company.status == 'success') {
        this.companyList = company.result;
        if(this.companyList.length >0){
          this.selectedcompany.company_id=this.companyList[0].company_id._id
          this.getCompanyUsers()
          }
      }
    })
  }

  async selectCompany(data) {
    this.showLoader = true;
    this.chathistory = []
    this.anotherRecrList = []
    this.currenttabidcss = false
    await this.AllchatserviceService1.CompanyRelatedUsers(this.selectedcompany.company_id).then(async user => {
      this.showLoader = false;
      if (user.status == 'success') {
        let data = []
        await Promise.all(user.result.map(async (element) => {
          await this.AllchatserviceService1.sndrRecrMsgCuntInfo(this.logeduserId, element.user_id._id).then(async obj => {
            element.user_id.notification_count = (obj.result.length == 0 ? 0 : obj.result[0].notification_count)
          })
          if (element.user_id._id != localStorage.getItem('id')) {
            data.push(element.user_id)
          }
        }));
        this.usersList = data
        this.usersList = this.usersList.sort((a, b) => b.online - a.online);
      }
    })
  }

  DeleteFun(obj) {
    this.AllchatserviceService1.deleteMsgFun(obj._id).then(msg => {
      if (msg.status == "success") {
        jQuery('#msgDeleteModel').modal('hide');
        this.socket.emit('emitDeletedMsg',obj)
        this.oneToOneChat()
      }
    })
  }

  delt(msg) {
    this.msgInfo = msg
  }

  timeSince(prev) {
    this.previous = new Date(prev)
    let d = this.previous
    let datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
      d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return datestring;

  }


  async getCompanyUsers1(){
    await this.AllchatserviceService1.CompanyRelatedUsers(this.companyList[0].company_id._id).then(async user => {
      if (user.status == 'success') {
        let data = []
        await Promise.all(user.result.map(async (element) => {
          await this.AllchatserviceService1.sndrRecrMsgCuntInfo(this.logeduserId, element.user_id._id).then(async obj => {
            element.user_id.notification_count = (obj.result.length == 0 ? 0 : obj.result[0].notification_count)
          })
  
          if (element.user_id._id != localStorage.getItem('id')) {
            data.push(element.user_id)
          }
        }));
        this.usersList = data
        if (this.usersList && this.usersList.length > 0) {
          this.usersList = this.usersList.sort((a, b) => b.online - a.online);
        }
      }
    })
  }

}
