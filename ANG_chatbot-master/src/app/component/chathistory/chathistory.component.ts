import { Component, OnInit, OnChanges, Pipe, EventEmitter, Output } from '@angular/core';
import { ChathistoryService } from './chathistory.service';
import { SidepanelserviceService } from '../sidepanel/sidepanelservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';
import { Constant } from '../../app.constant';
import { ISubscription } from 'rxjs/Subscription';
import { Getseleteddata } from '../../app.commonValue';
import { Chatroutering } from '../../app.commonValue';
import * as io from 'socket.io-client';
// import * as _ from "lodash";
import * as _ from 'underscore';
import { timeout } from 'q';
declare var jQuery: any;
declare var $: any;
import { saveAs } from 'file-saver';


interface Socketoperator {
  Id: string;
  key: string;
}
@Component({
  selector: 'app-chathistory',
  templateUrl: './chathistory.component.html',
  styleUrls: ['./chathistory.component.css']
})
export class ChathistoryComponent implements OnInit {

  @Output() serverCreated = new EventEmitter<{ ActiveDisplayName: string }>();
  // @Output() blueprintCreated = new EventEmitter<{ name: string, content: string }>();
  socket: SocketIOClient.Socket;
  private applicationModuleSubscription1: ISubscription;
  response = [];
  private body = '';
  public disabled: boolean;
  disconnecte = false;
  disconnected = false;
  showLoader = false;
  showFlag = false;
  istyping = true;
  typebox = true;
  typebox1 = false;
  status: string;
  currenttabidcss = false;
  currenttabid: string;
  public chathistory: any = [];
  private istypingusers: any = [];
  public userbrowsing: any = [];
  public usersList: any = [];
  private array: any = [];
  public usernamekey: any = {};
  public companyList: any = [];
  public selectedcompany: any = {};
  msgcount: number = 0;
  public usrsCount: number = 0;
  pagenumber: number = 0;
  key: string;
  start_index: number;
  private userId: string;
  private userparamsId: string;
  private logeduserId: string;
  public currentDate: any;
  public previous: any;
  public curnttDate: String;
  public role;
  reverse = false;
  messageText: string;
  images = {};
  showpreview = false;
  msgInfo;
  msgInfo1;
  isbottom;
  scrollingView = false;
  loadoption = false
  loadoption1 = true
  public Category = {
    image: ''
  }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
  constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private ChathistoryService: ChathistoryService,
    private Sidepanelservice: SidepanelserviceService,
    private getseleteddata: Getseleteddata,
    private chatroutering: Chatroutering) {
    this.socket = io.connect(Constant.url);

  }

  async ngOnInit() {
    this.loadoption = false
    this.loadoption1 = true
    this.disabled = true;
    document.title = 'Chat History';
    this.showLoader = true;
    this.disconnecte = false;
    this.disconnected = false;
    this.isbottom = 0
    this.typebox = true;
    this.userId = this.route.snapshot.params['id']
    this.userparamsId = this.route.snapshot.params['id']
    // this.userId = localStorage.getItem('id')
    this.logeduserId = localStorage.getItem('id')
    this.role = localStorage.getItem('role');
    // this.allUsersList();

    this.getMsgList();
    this.userId;
    this.getusercompanies();
    // this.applicationModuleSubscription1 = this.chatroutering.chatroutering.subscribe((data: any) => {
    //   console.log("--------------123----------", data)
    // });
    let presenturl = this.userId;
    this.router.events.subscribe((event) => {
      // setTimeout(function () {
      this.userId = this.route.snapshot.params['id'];
      if (presenturl !== this.userId) {
        // }, 10);
        presenturl = this.userId;
        this.getMsgList();
        this.typebox = true;
        this.typebox1 = false;
      }
    });


    this.socket.on('EmitMessageTorecevr', (msg: any) => {
      if (this.userId != undefined && this.logeduserId == msg.recer_id && this.userId == msg.sndr_id) {
        this.chathistory.push(msg);
        // this.msgcount = this.chathistory.length
        // console.log("+++++++++++++++++++", msg.sndr_id)
        // this.ChathistoryService.notificationsUpdate(this.logeduserId, this.userId).then(userdata => {
        // })
        this.onScroll(false)
        setTimeout(() => {
          this.chathistory.forEach(element => {
            this.msgcount = 0
            element.msg_blue = false
            element.msg_unread = false
          });
          this.oneToOneChat();
        }, 100);

        this.sectionScrlTop();
        // const updateddata = this.socketupdate(msg.data, msg);
        setTimeout(() => {
          this.socket.emit('messageIsRededByUser', { recer_id: msg.sndr_id, sender_id: msg.recer_id });
        }, 1000);
      }
    });

    this.socket.on('messageIsRededByUserEmit', (msg: any) => {
      // console.log('================',this.logeduserId , msg.recer_id ,this.userId , msg.sendr_id)
      if (this.userId != undefined && this.logeduserId == msg.sendr_id && this.userId == msg.recer_id) {
        // console.log('================')
        this.chathistory.push(msg);
        this.msgcount = this.chathistory.length
        this.oneToOneChat();
      }
    });

    this.socket.on('notificationEmit', (data: any) => {
      let userArr = []
      this.usersList.forEach(element => {
        if ((element._id == data.recer_id) && this.userId != data.recer_id) {
          this.ChathistoryService.sndrRecrMsgCuntInfo(this.logeduserId, element._id).then(async obj => {
            element.notification_count = (obj.result.length == 0 ? 0 : obj.result[0].notification_count)
          })
          // element.notification_count = data.notification_count
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
      // this.usersList.push(data.result)
      // this.usersList = this.usersList.sort((a, b) => b.online - a.online);
      this.getCompanyUsers1()
    });


    this.socket.on('emitDeletedMsgToUser', (data: any) => {
      // this.usersList.push(data.result)
      // this.usersList = this.usersList.sort((a, b) => b.online - a.online);
      if ((data.recer_id._id == this.logeduserId) || (data.sendr_id._id == this.logeduserId)) {
        this.oneToOneChat();
      }
    });

    this.socket.on('customerTyping', (data: any) => {
      let userArr = []
      this.usersList.forEach(element => {
        if ((element._id == data.recer_id)) {
          this.ChathistoryService.sndrRecrMsgCuntInfo(this.logeduserId, element._id).then(async obj => {
            element.is_typing = (obj.result.length == 0 ? false : (obj.result[0].is_typing == undefined ? false : obj.result[0].is_typing))
          })
          // && this.userId == data.recer_id
        }
        userArr.push(element)
      });
      this.usersList = userArr
    });


    this.socket.on('customerStopTypingData', (data: any) => {
      let userArr = []
      this.usersList.forEach(element => {
        if ((element._id == data.recer_id)) {
          this.ChathistoryService.sndrRecrMsgCuntInfo(this.logeduserId, element._id).then(async obj => {
            element.is_typing = (obj.result.length == 0 ? false : (obj.result[0].is_typing == undefined ? false : obj.result[0].is_typing))
          })
          // element.notification_count = data.notification_count  && this.userId == data.recer_id
        }
        userArr.push(element)
      });
      this.usersList = userArr
    });

  }


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


  downloadImg(url, y) {
    saveAs(url, y.document_name);
  }

  sendmessage(messageText) {
    if (typeof this.messageText !== 'undefined' && this.messageText !== '' && (this.messageText) && (this.messageText.trim() != '')) {
      localStorage.setItem('chat-key', this.userId);
      let reply_nm;
      reply_nm = this.msgInfo != undefined ? this.msgInfo.sendr_id.email : ''
      // if(this.msgInfo != undefined && this.msgInfo.sendr_id._id == localStorage.getItem('id')){
      //    reply_nm =  'You'
      // }
      let reply_msg = this.msgInfo != undefined ? this.msgInfo.messages : ''
      this.socket.emit('sendMessage', {
        messageText: this.messageText, recer_id: this.userId, sndr_id: this.logeduserId, type: 'normal',
        reply_nm: reply_nm, reply_msg: reply_msg
      });
      this.socket.emit('OperatorStopTyping', { recer_id: this.userId, sendr_id: localStorage.getItem('id') });
      //   $('.content-wrapper').scrollTop(20);
      //   $('.content-wrapper').animate({
      //     scrollTop: $('.content-wrapper').offset().top
      // }, 1000);
      // this.sectionScrlTop();
      this.messageText = '';
      // $(".content-wrapper").scroll();
      // $('#m').focus();
      let temp = {};
      temp['messages'] = messageText
      temp['recer_id'] = this.userId
      temp['sndr_id'] = this.logeduserId
      temp['type'] = 'normal'
      // this.chathistory.push(temp)
      this.ChathistoryService.msgSendToUser({}).then(response => {
        this.oneToOneChat();
      });
      this.sectionScrlTop();
      $(".content-wrapper").scroll();
      $('#m').focus();
      if (this.msgInfo != undefined) {
        delete this.msgInfo
      }
    } else {
      const info: FormData = new FormData();
      if (this.Category != undefined && this.Category.image != '') {
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
        this.ChathistoryService.imageSendToUser(info).then(response => {
          this.socket.emit('sendfile', response);
          // this.chathistory.push(response.result)
          this.images = '';
          this.showpreview = false;
          this.oneToOneChat();
        });
      }
    }
  }

  send = (event) => {
    setTimeout(() => {
      this.outfocus();
    }, 4000)
  }

  valuechange(newValue) {
    let value = newValue.length
    if (newValue.length >= 1) {
      this.onfocus();
    } else if (newValue.length < 1) {
      this.outfocus();
    }
  }
  // (click)="onfocus(messageText)"
  onfocus() {
    console.log('2')
    this.socket.emit('OperatorTyping', { recer_id: this.userId, sendr_id: localStorage.getItem('id') });
    // console.log("---------starttyping--------", this.userId)
  }
  outfocus() {
    // console.log("------------stopped-----", this.userId)
    this.socket.emit('OperatorStopTyping', { recer_id: this.userId, sendr_id: localStorage.getItem('id') });
  }

  joindata() {
    this.typebox = false;
  }
  openscrollBlue() {
    this.sectionScrlTop()
  }

  openscroll() {
    // setTimeout(() => {
    this.sectionScrlTop()
    // }, 500);
  }
  sectionScrlTop() {
    const $target = $('.direct-chat-messages');
    if ($target[0] != undefined && $target[0].scrollHeight != undefined) {
      $target.animate({ scrollTop: $target[0].scrollHeight }, 500);
    }
  }

  sectionScrlTop1() {
    const $target = $('.direct-chat-messages');
    $target.animate({ scrollTop: $target[0].scrollHeight }, 500);
  }

  async allUsersList() {
    if (localStorage.getItem('role') == 'ADMIN') {
      await this.ChathistoryService.listAllUsers().then(async response => {
        // this.usersList = response.result;
        if (response.result.length > 0) {
          this.userId = response.result[0].user_id._id
          // response.result.forEach(element => {
          await Promise.all(response.result.map(async (element) => {
            this.ChathistoryService.sndrRecrMsgCuntInfo(this.logeduserId, element.user_id._id).then(async obj => {
              element.user_id.notification_count = (obj.result.length == 0 ? 0 : obj.result[0].notification_count)
              element.user_id.is_typing = (obj.result.length == 0 ? false : (obj.result[0].is_typing == undefined ? false : obj.result[0].is_typing))
            })
            if (element.user_id._id != this.logeduserId) {
              this.usersList.push(element.user_id)
            }
          }));
          if (this.usersList && this.usersList.length > 0) {
            this.usersList = this.usersList.sort((a, b) => b.online - a.online);
            this.router.navigate(['/chathistory/' + this.usersList[0]._id]);
            this.selectedUser(this.usersList[0])
            this.usrsCount = this.usersList.length;
          }
          // this.getMsgList();
        }
      });
    }
  }


  async getCompanyUsers() {
    if (this.companyList.length > 0) {
      await this.ChathistoryService.CompanyRelatedUsers(this.companyList[0].company_id._id).then(async user => {
        this.showLoader = false;
        if (user.status == 'success') {
          // this.usersList = user.result;
          let data = []
          await Promise.all(user.result.map(async (element) => {
            await this.ChathistoryService.sndrRecrMsgCuntInfo(this.logeduserId, element.user_id._id).then(async obj => {
              element.user_id.notification_count = (obj.result.length == 0 ? 0 : obj.result[0].notification_count)
              element.user_id.is_typing = (obj.result.length == 0 ? false : (obj.result[0].is_typing == undefined ? false : obj.result[0].is_typing))
            })

            if (element.user_id._id != localStorage.getItem('id')) {
              data.push(element.user_id)
            }
          }));
          this.usersList = data
          // if (localStorage.getItem('role') != 'ADMIN') {
          //   if (this.usersList && this.usersList.length > 0) {
          //     this.usersList = this.usersList.sort((a, b) => b.online - a.online);
          //     this.router.navigate(['/chathistory/' + this.usersList[0]._id]);
          //     this.selectedUser(this.usersList[0])
          //     this.usrsCount = this.usersList.length;
          //   }
          // }else{
          this.usersList = this.usersList.sort((a, b) => b.online - a.online);
          // this.router.navigate(['/chathistory/' + this.usersList[0]._id]);
          this.selectedUser(this.usersList[0])
          this.usrsCount = this.usersList.length;
          // }
        }
      })
    }
  }

  async getMsgList() {
    this.showLoader = true;
    if (this.userId != undefined) {
      this.pagenumber = 0;
      this.isbottom = 0
      const pageno = this.pagenumber;
      await this.ChathistoryService.getMessagesList(this.userId, pageno, this.isbottom).then(async response => {
        this.showLoader = false;
        // this.msgcount = response.result.length;

        this.chathistory = response.result;
       await this.chathistory.forEach(async element => {
          element.curnttDate = this.timeSince(element.createdAt)
          if (element.messages) {
            var re = new RegExp("\\b(((ht|f)tp(s?)\\:\\/\\/|~\\/|\\/)|www.)" +
              "(\\w+:\\w+@)?(([-\\w]+\\.)+(com|org|net|gov" +
              "|mil|biz|info|mobi|name|aero|jobs|museum" +
              "|travel|[a-z]{2}))(:[\\d]{1,5})?" +
              "(((\\/([-\\w~!$+|.,=]|%[a-f\\d]{2})+)+|\\/)+|\\?|#)?" +
              "((\\?([-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)" +
              "(&(?:[-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)*)*" +
              "(#([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)?\\b", "i");
            var str = element.messages;
            var match = re.test(str);
            if (match) {
              element.messagesLinks = this.UriphiMe(element.messages)
            }
            if (this.messagePreTag(element.messages)) {
              element.messagesPreTag = this.messagePreTag(element.messages)
            }
          }
          if (element.reply_msg !== undefined && element.reply_msg) {
            var re = new RegExp("\\b(((ht|f)tp(s?)\\:\\/\\/|~\\/|\\/)|www.)" +
              "(\\w+:\\w+@)?(([-\\w]+\\.)+(com|org|net|gov" +
              "|mil|biz|info|mobi|name|aero|jobs|museum" +
              "|travel|[a-z]{2}))(:[\\d]{1,5})?" +
              "(((\\/([-\\w~!$+|.,=]|%[a-f\\d]{2})+)+|\\/)+|\\?|#)?" +
              "((\\?([-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)" +
              "(&(?:[-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)*)*" +
              "(#([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)?\\b", "i");
            var str = element.reply_msg;
            var match = re.test(str);
            if (match) {
              element.messagesLinks1 = this.UriphiMe(element.reply_msg)
            }
          }
        });
        this.msgcount = response.countNum;

        // setTimeout(() => {
        //   this.openscroll()
        // }, 100);
        // if(StartScroll == 0 || this.logeduserId != this.userId) {
        if (response.countNum != undefined && response.countNum > 0) {
          this.openscrollBlue()
          // $(".content-wrapper").scroll();
          // $('#m').focus();
        } else {
          setTimeout(() => {
            this.sectionScrlTop()
          }, 500);
          // $(".content-wrapper").scroll();
          // $('#m').focus();
        }
        // }
        this.disabled = false;
      });

    }
  }

  getmoredata() {
    console.log('--load--')
    const pageno = this.pagenumber + 1;
    this.pagenumber = pageno;
    this.showLoader = true;
    if (this.userId != undefined) {
      this.ChathistoryService.getMessagesList(this.userId, pageno, this.isbottom).then(response => {
        this.showLoader = false;
        this.loadoption = false
        this.loadoption1 = true
        // if(this.msgcount == response.result.length){
        //   this.loadoption1 = false
        // }
        // this.msgcount = response.result.length;
        this.msgcount = response.countNum;

        this.chathistory = response.result;
        this.chathistory.forEach(element => {
          element.curnttDate = this.timeSince(element.createdAt)
          if (element.messages) {
            var re = new RegExp("\\b(((ht|f)tp(s?)\\:\\/\\/|~\\/|\\/)|www.)" +
              "(\\w+:\\w+@)?(([-\\w]+\\.)+(com|org|net|gov" +
              "|mil|biz|info|mobi|name|aero|jobs|museum" +
              "|travel|[a-z]{2}))(:[\\d]{1,5})?" +
              "(((\\/([-\\w~!$+|.,=]|%[a-f\\d]{2})+)+|\\/)+|\\?|#)?" +
              "((\\?([-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)" +
              "(&(?:[-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)*)*" +
              "(#([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)?\\b", "i");
            var str = element.messages;
            var match = re.test(str);
            if (match) {
              element.messagesLinks = this.UriphiMe(element.messages)
            }
            if (this.messagePreTag(element.messages)) {
              element.messagesPreTag = this.messagePreTag(element.messages)
            }
          }
          if (element.reply_msg !== undefined && element.reply_msg) {
            var re = new RegExp("\\b(((ht|f)tp(s?)\\:\\/\\/|~\\/|\\/)|www.)" +
              "(\\w+:\\w+@)?(([-\\w]+\\.)+(com|org|net|gov" +
              "|mil|biz|info|mobi|name|aero|jobs|museum" +
              "|travel|[a-z]{2}))(:[\\d]{1,5})?" +
              "(((\\/([-\\w~!$+|.,=]|%[a-f\\d]{2})+)+|\\/)+|\\?|#)?" +
              "((\\?([-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)" +
              "(&(?:[-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)*)*" +
              "(#([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)?\\b", "i");
            var str = element.reply_msg;
            var match = re.test(str);
            if (match) {
              element.messagesLinks1 = this.UriphiMe(element.reply_msg)
            }
          }
        });
        // setTimeout(() => {
        //   this.openscroll()
        // }, 100);
        this.disabled = false;
      });

    }
  }

  messagePreTag(str) {
    var a = document.createElement('div');
    a.innerHTML = str;

    for (var c = a.childNodes, i = c.length; i--;) {
      if (c[i].nodeType == 1) return true;
    }

    return false;
  };
  UriphiMe(text) {
    var exp = /(\b((https?|ftp|file):\/\/|(www))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]*)/ig;
    return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
  }

  oneToOneChat() {
    if (this.userId != undefined) {
      this.pagenumber = 0;
      const pageno = this.pagenumber;
      this.ChathistoryService.getMessagesList(this.userId, pageno, this.isbottom).then(response => {
        // this.msgcount = response.result.length;
        this.msgcount = response.countNum;

        this.chathistory = response.result;
        this.chathistory.forEach(element => {
          element.curnttDate = this.timeSince(element.createdAt)
          if (element.messages) {
            var re = new RegExp("\\b(((ht|f)tp(s?)\\:\\/\\/|~\\/|\\/)|www.)" +
              "(\\w+:\\w+@)?(([-\\w]+\\.)+(com|org|net|gov" +
              "|mil|biz|info|mobi|name|aero|jobs|museum" +
              "|travel|[a-z]{2}))(:[\\d]{1,5})?" +
              "(((\\/([-\\w~!$+|.,=]|%[a-f\\d]{2})+)+|\\/)+|\\?|#)?" +
              "((\\?([-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)" +
              "(&(?:[-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)*)*" +
              "(#([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)?\\b", "i");
            var str = element.messages;
            var match = re.test(str);
            if (match) {
              element.messagesLinks = this.UriphiMe(element.messages)
            }
            if (this.messagePreTag(element.messages)) {
              element.messagesPreTag = this.messagePreTag(element.messages)
            }
          }
          if (element.reply_msg !== undefined && element.reply_msg) {
            var re = new RegExp("\\b(((ht|f)tp(s?)\\:\\/\\/|~\\/|\\/)|www.)" +
              "(\\w+:\\w+@)?(([-\\w]+\\.)+(com|org|net|gov" +
              "|mil|biz|info|mobi|name|aero|jobs|museum" +
              "|travel|[a-z]{2}))(:[\\d]{1,5})?" +
              "(((\\/([-\\w~!$+|.,=]|%[a-f\\d]{2})+)+|\\/)+|\\?|#)?" +
              "((\\?([-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)" +
              "(&(?:[-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)*)*" +
              "(#([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)?\\b", "i");
            var str = element.reply_msg;
            var match = re.test(str);
            if (match) {
              element.messagesLinks1 = this.UriphiMe(element.reply_msg)
            }
          }
        });
        // this.sectionScrlTop();
        if (response.countNum != undefined && response.countNum > 0) {
          this.openscrollBlue()
          // $(".content-wrapper").scroll();
          // $('#m').focus();
        } else {
          setTimeout(() => {
            this.sectionScrlTop()
          }, 200);
          // $(".content-wrapper").scroll();
          // $('#m').focus();
        }

      });
    }
  }

  selectedUser(userDetail) {
    // this.sectionScrlTop();
    if (userDetail != undefined && userDetail != null) {
      setTimeout(() => {
        // this.sectionScrlTop();
        this.currenttabidcss = true;
        this.currenttabid = userDetail._id;
        this.userId = userDetail._id
        this.userparamsId = userDetail._id
        // this.route.snapshot.params['id']
        this.getMsgList();
        // this.ChathistoryService.notificationsUpdate(this.logeduserId, userDetail._id).then(userdata => {
        let userArr = []
        this.usersList.forEach(element => {
          if (element._id == this.userId) {
            element.notification_count = 0
          }
          userArr.push(element)
        });
        this.usersList = userArr
        // // this.usersList = this.usersList.sort((a, b) => b.online - a.online);
        // this.sectionScrlTop();

        // })

        this.socket.emit('messageIsRededByUser', { recer_id: userDetail._id, sender_id: localStorage.getItem('id') });
      }, 200)
    }
  }

  getusercompanies() {
    this.ChathistoryService.userRelatedCompany(localStorage.getItem('id')).then(company => {
      if (company.status == 'success') {
        this.companyList = company.result;
        if (this.companyList.length > 0) {
          this.selectedcompany.company_id = this.companyList[0].company_id._id
          this.getCompanyUsers()
        }
      }
    })
  }

  async selectCompany(data) {
    this.showLoader = true;
    await this.ChathistoryService.CompanyRelatedUsers(this.selectedcompany.company_id).then(async user => {
      this.showLoader = false;
      if (user.status == 'success') {
        // this.usersList = user.result;
        let data = []
        await Promise.all(user.result.map(async (element) => {
          await this.ChathistoryService.sndrRecrMsgCuntInfo(this.logeduserId, element.user_id._id).then(async obj => {
            element.user_id.notification_count = (obj.result.length == 0 ? 0 : obj.result[0].notification_count)
            element.user_id.is_typing = (obj.result.length == 0 ? false : (obj.result[0].is_typing == undefined ? false : obj.result[0].is_typing))
          })
          if (element.user_id._id != localStorage.getItem('id')) {
            data.push(element.user_id)
          }
        }));
        this.usersList = data
        this.usersList = this.usersList.sort((a, b) => b.online - a.online);
        this.usrsCount = this.usersList.length;
      }
    })
  }

  DeleteFun(obj) {
    this.ChathistoryService.deleteMsgFun(obj._id).then(msg => {
      if (msg.status == "success") {
        jQuery('#msgDeleteModel').modal('hide');
        this.socket.emit('emitDeletedMsg', obj)
        this.oneToOneChat()
      }
    })
    if (this.msgInfo != undefined) {
      delete this.msgInfo
    }
  }

  cancel() {
    if (this.msgInfo != undefined) {
      delete this.msgInfo
    }
  }
  delt(msg) {
    this.msgInfo = this.msgInfo1
    const $target = $('.content-wrapper');
    $target.animate({ scrollTop: $target[0].scrollHeight }, 500);
    this.sectionScrlTop();
    // console.log('---------',msg,localStorage.getItem('id'))
  }

  delt1(msg) {
    this.msgInfo1 = msg
    const $target = $('.content-wrapper');
    $target.animate({ scrollTop: $target[0].scrollHeight }, 500);
    // this.sectionScrlTop();
  }

  timeSince(prev) {
    this.previous = new Date(prev)
    let d = this.previous
    let datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
      d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return datestring;

  }

  async getCompanyUsers1() {
    await this.ChathistoryService.CompanyRelatedUsers(this.companyList[0].company_id._id).then(async user => {
      if (user.status == 'success') {
        let data = []
        await Promise.all(user.result.map(async (element) => {
          await this.ChathistoryService.sndrRecrMsgCuntInfo(this.logeduserId, element.user_id._id).then(async obj => {
            element.user_id.notification_count = (obj.result.length == 0 ? 0 : obj.result[0].notification_count)
            element.user_id.is_typing = (obj.result.length == 0 ? false : (obj.result[0].is_typing == undefined ? false : obj.result[0].is_typing))
          })

          if (element.user_id._id != localStorage.getItem('id')) {
            data.push(element.user_id)
          }
        }));
        this.usersList = data
        if (this.usersList && this.usersList.length > 0) {
          this.usersList = this.usersList.sort((a, b) => b.online - a.online);
          this.usrsCount = this.usersList.length;
        }
      }
    })
  }

  onScroll(isOn) {
    // setTimeout(() => {
      if (!isOn) {
        console.log('--------++++++1+++++++---------------',isOn)
        this.msgcount = 0
      }
      this.msgcount = this.msgcount
      console.log('--------this.msgcount-------',this.msgcount)
    this.ChathistoryService.notificationsUpdate(this.logeduserId, this.userId, this.msgcount).then(userdata => {
      let userArr = []
      this.usersList.forEach(element => {
        if (userdata.result != undefined && element._id == userdata.result.recer_id) {
          element.notification_count =0
          if (isOn) {
            console.log('--------+++++++++++++------ -1 * (element.notification_count - this.msgcount)---------')
            element.notification_count = element.notification_count 
          }
        }
        userArr.push(element)
      });
      this.usersList = userArr
      this.commonFun(isOn)
    });
    // }, 500);
  }

  commonFun(isOn) {
    if (this.userId != undefined) {
      this.pagenumber = 0;
      const pageno = this.pagenumber;
      // this.msgcount = 0;
      // this.isbottom = 1
      if(isOn == true){
        this.isbottom = 1
        this.ChathistoryService.getMessagesList(this.userId, pageno, this.isbottom).then(response => {
        // this.msgcount = response.result.length;
        this.msgcount = response.countNum;
        this.chathistory = response.result;
      this.chathistory.forEach(element => {
        element.curnttDate = this.timeSince(element.createdAt)
        if (element.messages) {
          var re = new RegExp("\\b(((ht|f)tp(s?)\\:\\/\\/|~\\/|\\/)|www.)" +
            "(\\w+:\\w+@)?(([-\\w]+\\.)+(com|org|net|gov" +
            "|mil|biz|info|mobi|name|aero|jobs|museum" +
            "|travel|[a-z]{2}))(:[\\d]{1,5})?" +
            "(((\\/([-\\w~!$+|.,=]|%[a-f\\d]{2})+)+|\\/)+|\\?|#)?" +
            "((\\?([-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
            "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)" +
            "(&(?:[-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
            "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)*)*" +
            "(#([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)?\\b", "i");
          var str = element.messages;
          var match = re.test(str);
          if (match) {
            element.messagesLinks = this.UriphiMe(element.messages)
          }
          if (this.messagePreTag(element.messages)) {
            element.messagesPreTag = this.messagePreTag(element.messages)
          }
        }
        if (element.reply_msg !== undefined && element.reply_msg) {
          var re = new RegExp("\\b(((ht|f)tp(s?)\\:\\/\\/|~\\/|\\/)|www.)" +
            "(\\w+:\\w+@)?(([-\\w]+\\.)+(com|org|net|gov" +
            "|mil|biz|info|mobi|name|aero|jobs|museum" +
            "|travel|[a-z]{2}))(:[\\d]{1,5})?" +
            "(((\\/([-\\w~!$+|.,=]|%[a-f\\d]{2})+)+|\\/)+|\\?|#)?" +
            "((\\?([-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
            "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)" +
            "(&(?:[-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
            "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)*)*" +
            "(#([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)?\\b", "i");
          var str = element.reply_msg;
          var match = re.test(str);
          if (match) {
            element.messagesLinks1 = this.UriphiMe(element.reply_msg)
          }
        }
        if(!isOn){
          this.ChathistoryService.notificationsUpdate(this.logeduserId, this.userId, 0).then(userdata => {
            console.log('-----yui-------',this.logeduserId, this.userId, 0,'+++',userdata)
          })
        }
        setTimeout(() => {
          // element.msg_blue = false
          // element.msg_unread = false
        }, 500);

      });
    });
      }else{
      // this.ChathistoryService.getMessagesList(this.userId, pageno, this.isbottom).then(response => {
      //   // this.msgcount = response.result.length;
      //   this.msgcount = response.countNum;
      //   this.chathistory = response.result;
        this.chathistory.forEach(element => {
          element.curnttDate = this.timeSince(element.createdAt)
          if (element.messages) {
            var re = new RegExp("\\b(((ht|f)tp(s?)\\:\\/\\/|~\\/|\\/)|www.)" +
              "(\\w+:\\w+@)?(([-\\w]+\\.)+(com|org|net|gov" +
              "|mil|biz|info|mobi|name|aero|jobs|museum" +
              "|travel|[a-z]{2}))(:[\\d]{1,5})?" +
              "(((\\/([-\\w~!$+|.,=]|%[a-f\\d]{2})+)+|\\/)+|\\?|#)?" +
              "((\\?([-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)" +
              "(&(?:[-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)*)*" +
              "(#([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)?\\b", "i");
            var str = element.messages;
            var match = re.test(str);
            if (match) {
              element.messagesLinks = this.UriphiMe(element.messages)
            }
            if (this.messagePreTag(element.messages)) {
              element.messagesPreTag = this.messagePreTag(element.messages)
            }
          }
          if (element.reply_msg !== undefined && element.reply_msg) {
            var re = new RegExp("\\b(((ht|f)tp(s?)\\:\\/\\/|~\\/|\\/)|www.)" +
              "(\\w+:\\w+@)?(([-\\w]+\\.)+(com|org|net|gov" +
              "|mil|biz|info|mobi|name|aero|jobs|museum" +
              "|travel|[a-z]{2}))(:[\\d]{1,5})?" +
              "(((\\/([-\\w~!$+|.,=]|%[a-f\\d]{2})+)+|\\/)+|\\?|#)?" +
              "((\\?([-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)" +
              "(&(?:[-\\w~!$+|.,*:]|%[a-f\\d{2}])+=?" +
              "([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)*)*" +
              "(#([-\\w~!$+|.,*:=]|%[a-f\\d]{2})*)?\\b", "i");
            var str = element.reply_msg;
            var match = re.test(str);
            if (match) {
              element.messagesLinks1 = this.UriphiMe(element.reply_msg)
            }
          }
          if(!isOn){
            this.ChathistoryService.notificationsUpdate(this.logeduserId, this.userId, 0).then(userdata => {
              console.log('------------',this.logeduserId, this.userId, 0,'+++',userdata)
            })
          }
          setTimeout(() => {
            element.msg_blue = false
            element.msg_unread = false
          }, 100);
        });
        
      }
      // });
    }
  }

}





