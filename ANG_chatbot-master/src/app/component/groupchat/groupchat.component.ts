import { Component, OnInit, OnDestroy } from '@angular/core';
import { GroupchatService } from './groupchat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupsService } from '../groups/groups.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
declare var jQuery: any;
import { Constant } from '../../app.constant';
import * as io from 'socket.io-client';
interface Socketoperator {
  Id: string;
  key: string;
}
@Component({
  selector: 'app-groupchat',
  templateUrl: './groupchat.component.html',
  styleUrls: ['./groupchat.component.css']
})
export class GroupchatComponent implements OnInit, OnDestroy {
  socket: SocketIOClient.Socket;

  response = [];
  public usersList: any = [];
  public userRoleslist: any = [];
  public UsersCount: number = 0;
  public usrsCount: number = 0;
  public groupusersList: any = [];
  public addUserTogroup: any = {};
  public role;
  isbottom;
  public groupDetails: any = {};
  public previous: any;
  group_id;
  msgcount: number = 0;
  key: string;
  start_index: number;
  private company_id: string;
  private logeduserId: string;
  reverse = false;
  messageText: string;
  public chathistory: any = [];
  public chatUserGroupList: any = [];
  showLoader = false;
  images = {};
  public showaddUser;
  public showaddUserflag = false;
  public showDeleteUser;
  public deleteShowaddUserflag = false;
  msgInfo;
  msgInfo1;
  replyPrivate;
  testId;
  deleteuserfromgroupdata;
  deleteuserfromgroupdataName;
  showpreview = false;
  scrollingView = false;
  loadoption = false
  loadoption1 = true
  pagenumber: number = 0;
  public Category = {
    image: ''
  }
  group_id5;
  constructor(private router: Router, private route: ActivatedRoute, private groupchatService: GroupchatService,
    private groupsService: GroupsService, private sanitizer: DomSanitizer) {
    this.socket = io.connect(Constant.url);
  }

  ngOnInit() {
    this.loadoption = false
    this.loadoption1 = true
    this.isbottom = 0
    this.group_id = this.route.snapshot.params['id'];
    this.group_id5 = this.route.snapshot.paramMap.get('id');
    this.getGropUsers();
    this.getGroupDetails();
    this.getGroupChatMsgs();
    this.logeduserId = localStorage.getItem('id');
    this.role = localStorage.getItem('role');
    // this.getusersList();
    this.testId = localStorage.setItem('current_group_id', this.route.snapshot.params['id'])
    // console.log('-----------',this.group_id,this.group_id5)
    this.socket.on('GroupOperatorTypingEmit', (msg: any) => {
      if (this.group_id == msg.group_id) {
        this.groupchatService.getGroupUserslist(msg.group_id).then(user => {
          if (user.status == 'success') {
            this.groupusersList = user.result;
            this.usrsCount = user.result.length;
            let temp2 = []
            this.groupusersList.forEach(element => {
              if (element.is_typing_group == true && this.logeduserId != element.user_id._id) {
                temp2.push(element.user_id.email)
              }
            });
            this.chatUserGroupList = temp2
          }
        })
      }
    })

    this.socket.on('GroupOperatorStopTypingEmit', (msg: any) => {
      if (this.group_id == msg.group_id) {
        this.groupchatService.getGroupUserslist(msg.group_id).then(user => {
          if (user.status == 'success') {
            this.groupusersList = user.result;
            this.usrsCount = user.result.length;
            let temp2 = []
            this.groupusersList.forEach(element => {
              if (element.is_typing_group == true && this.logeduserId != element.user_id._id) {
                temp2.push(element.user_id.email)
              }
            });
            this.chatUserGroupList = temp2
          }
        })
      }
    })

    this.socket.on('messageIsRededByUserIGroupEmit1', (msg: any) => {
      if (this.group_id5 == msg.group_id && msg.sendr_id == localStorage.getItem('id')) {
        // console.log('----------------',this.group_id5 , msg.group_id,msg.sendr_id, localStorage.getItem('id'))
        this.pagenumber = 0;
        const pageno = this.pagenumber;
        this.groupchatService.getGroupchatMsg(this.group_id, pageno, this.isbottom).then(response => {
          this.msgcount = response.countNum;
          // this.msgcount = response.result.length;
          this.chathistory = response.result;
          this.chathistory.forEach(element => {
            element.curnttDate = this.timeSince(element.createdAt)
          });
        });
        // this.sectionScrlTop();
      }
    });

    this.socket.on('messageIsRededByUserIGroupEmit', (msg: any) => {
      if (this.group_id5 == msg.group_id && msg.sendr_id != localStorage.getItem('id')) {
        // console.log('--------2--------',this.group_id5 , msg.group_id,msg.sendr_id, localStorage.getItem('id'),msg)
        this.pagenumber = 0;
        const pageno = this.pagenumber;
        this.groupchatService.getGroupchatMsg(this.group_id, pageno, this.isbottom).then(response => {
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
        });
        // this.sectionScrlTop();
      }
    });

    this.socket.on('EmitMessageTorecevr', (msg: any) => {
      if (this.group_id == msg.group_id) {
        this.chathistory.push(msg);
        // this.msgcount = this.chathistory.length
        this.msgcount = 0;
        this.pagenumber = 0;
        const pageno = this.pagenumber;
        this.groupchatService.getGroupchatMsg(this.group_id, pageno, this.isbottom).then(response => {
          // this.msgcount = response.result.length;

          this.chathistory = response.result;
          this.chathistory.forEach(element => {
            element.msg_blue = false
            element.msg_unread = false;
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
          this.openscroll1();
          this.msgcount = 0;

        });
        setTimeout(() => {
          if (this.group_id5 == msg.group_id && msg.sndr_id != localStorage.getItem('id')) {
            this.socket.emit('messageIsRededByUserIGroup1', { group_id: msg.group_id, sendr_id: msg.sndr_id });
            this.socket.emit('groupNotificationCounttoZero', { group_id: msg.group_id, sendr_id: localStorage.getItem('id') })
          }
        }, 1000);
      }
    });

    this.socket.on('sendInvitationToUser', (msg: any) => {
      this.groupchatService.getGroupUserslist(msg.result.group_id._id).then(user => {
        if (user.status == 'success') {
          this.groupusersList = user.result;
          this.usrsCount = user.result.length;
        }
      })
    })

    this.socket.on('refreshUserDropDowninGroup', async (msg: any) => {
      let EmptySet = []
      this.usersList.forEach(element => {
        if (element._id != 4) {
          EmptySet.push(element)
        }
      });
      this.usersList = EmptySet
      await this.usersList.push(msg)
      await this.usersList.push({ _id: 4, email: 'Select Users' })
      // this.usersList.unshift(msg)
      // this.usersList.splice((this.usersList - 1),0,msg)
    })

    this.socket.on('deltedUserRefreshOnceUsersListinGroup', (msg: any) => {
      let emptyArr = [];
      this.groupusersList.forEach(element => {
        if (element.user_id._id != msg.user_id._id) {
          emptyArr.push(element)
        }
      });
      // this.showDeleteUser = msg;
      // this.deleteShowaddUserflag = true;
      this.groupusersList = emptyArr
      this.usrsCount = emptyArr.length;
      this.pagenumber = 0;
      const pageno = this.pagenumber;
      this.groupchatService.getGroupchatMsg(this.group_id, pageno, this.isbottom).then(response => {
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
      });
    })

    this.socket.on('sendInvitationToUser', (data: any) => {
      // if (data.add_by != this.logeduserId) {
      // this.showaddUser = data.result;
      // this.showaddUserflag = true;
      this.pagenumber = 0;
      const pageno = this.pagenumber;
      this.groupchatService.getGroupchatMsg(this.group_id, pageno, this.isbottom).then(response => {
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
      });
      // }
    });

    this.socket.on('emitDeletedGroupMsgToUsers', (data: any) => {
      if (data.group_id._id == localStorage.getItem('current_group_id')) {
        this.getGroupChatMsgs();
      }
    });

  }

  openscroll1() {
    setTimeout(() => {
      this.sectionScrlTop()
      const $target = $('.content-wrapper');
      if ($target[0] != undefined && $target[0].scrollHeight != undefined) {
        $target.animate({ scrollTop: $target[0].scrollHeight }, 500);
      }
    }, 300);
  }

  openscroll() {
    setTimeout(() => {
      this.sectionScrlTop()
      const $target = $('.content-wrapper');
      if ($target[0] != undefined && $target[0].scrollHeight != undefined) {
        $target.animate({ scrollTop: $target[0].scrollHeight }, 500);
      }
    }, 500);
  }

  openscrollBlue() {
    this.sectionScrlTop()
  }


  getusersList(): void {
    this.showLoader = true;
    this.groupchatService.CompanyRelatedUsers(this.groupDetails.company_id).then(user => {
      this.showLoader = false;
      if (user.status == 'success') {
        // this.usersList = user.result;
        user.result.forEach(element => {
          if (element.user_id._id != this.logeduserId) {
            this.usersList.push(element.user_id)
          }
        });
        this.usersList.push({ _id: 4, email: 'Select Users' })
        this.UsersCount = user.result.length
      }
    })
  }

  addUsersTogroup(data) {
    // this.showLoader = true;
    this.groupchatService.userDetails(this.addUserTogroup._id).then(user => {
      // this.showLoader = false;
      if (user.status == 'success') {
        this.groupchatService.getGroupdetails(this.group_id).then(group => {
          let temp = {};
          temp['group_id'] = this.group_id;
          temp['user_id'] = user.result._id;
          temp['company_id'] = group.result.company_id;
          this.groupchatService.addNewuserToGroup(temp).then(groupUser => {
            let EmptySet1 = []
            this.usersList.forEach(element => {
              if (element._id != 4) {
                EmptySet1.push(element)
              }
            });
            this.usersList = EmptySet1
            this.usersList.push({ _id: 4, email: 'Select Users' })
            if (groupUser.status == false) {
              $('.alert').css('z-index', '9999');
              $('#error-alert-user-existed').fadeTo(2000, 500).slideDown(500, function () {
                $('#error-alert-user-existed').slideDown(500);
                $('.alert').css('z-index', '-1000');
              });
            } else {
              $('#success-alert').css('z-index', '9999');
              $('#success-alert').fadeTo(2000, 500).slideUp(500, function () {
                $('#success-alert').slideUp(500);
                $('.alert').css('z-index', '-1000');
              });
            }
            this.getGropUsers();
          })
        })
      }
    })
  }

  getGropUsers() {
    this.showLoader = true;
    this.groupchatService.getGroupUserslist(this.group_id).then(user => {
      this.showLoader = false;
      if (user.status == 'success') {
        this.groupusersList = user.result;
        this.usrsCount = user.result.length;
        let temp2 = []
        this.groupusersList.forEach(element => {
          if (element.is_typing_group == true && this.logeduserId != element.user_id._id) {
            temp2.push(element.user_id.email)
          }
        });
        this.chatUserGroupList = temp2
      }
    })
  }
  getGroupDetails() {
    this.groupchatService.getGroupdetails(this.group_id).then(group => {
      if (group.status == 'success') {
        this.groupDetails = group.result
        this.getusersList()
      }
    })
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

  sendmessage(messageText) {
    if (typeof this.messageText !== 'undefined' && this.messageText !== '' && (this.messageText) && (this.messageText.trim() != '')) {
      localStorage.setItem('chat-key', this.logeduserId);
      let reply_nm;
      reply_nm = this.msgInfo != undefined ? this.msgInfo.sendr_id.email : ''
      let reply_msg = this.msgInfo != undefined ? this.msgInfo.messages : ''
      if (this.replyPrivate == undefined && this.replyPrivate == '' || this.replyPrivate == null) {
        this.socket.emit('sendMessage', {
          messageText: this.messageText, group_id: this.group_id, type: 'group', sndr_id: this.logeduserId, user_id: this.logeduserId, company_id: this.groupDetails.company_id,
          reply_nm: reply_nm, reply_msg: reply_msg
        });
      } else {
        this.socket.emit('sendMessage', {
          messageText: this.messageText, recer_id: this.msgInfo.sendr_id._id, sndr_id: this.logeduserId, type: 'normal',
          reply_nm: reply_nm, reply_msg: reply_msg
        });
      }

      this.socket.emit('GroupOperatorStopTyping', { group_id: this.group_id, sendr_id: localStorage.getItem('id') });
      // this.chathistory.push({ messages: this.messageText, recer_id: this.userId,sendr_id:this.logeduserId });
      this.sectionScrlTop();
      this.messageText = '';
      $(".content-wrapper").scroll();
      $('#m').focus();
      // this.getGroupChatMsgs();
      // let temp = {};
      // temp['messages'] = messageText
      // temp['recer_id'] = this.userId
      // console.log('-------', temp)
      if (this.msgInfo != undefined) {
        delete this.msgInfo
      }
    } else {
      const info: FormData = new FormData();
      if (this.Category != undefined && this.Category.image != '') {
        for (const key in this.Category) {
          if (key === 'image') {
            info.append('image', this.Category[key]);
            info.append('group_id', this.group_id);
            info.append('sndr_id', this.logeduserId);
            info.append('type', 'group');
            info.append('company_id', this.groupDetails.company_id)
            info.append('user_id', this.logeduserId);
          }
        }
        this.sectionScrlTop();
        $(".content-wrapper").scroll();
        $('#m').focus();
        this.groupchatService.imageSendToUser(info).then(response => {
          // this.chathistory.push(response.result)
          this.socket.emit('sendfile', response);
          // this.chathistory.push(response.result)
          this.images = '';
          this.showpreview = false;
          this.getGroupChatMsgs();
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
    this.socket.emit('GroupOperatorTyping', { group_id: this.group_id, sendr_id: localStorage.getItem('id') });
    // console.log("---------starttyping--------", this.userId)
  }
  outfocus() {
    // console.log("------------stopped-----", this.userId)
    this.socket.emit('GroupOperatorStopTyping', { group_id: this.group_id, sendr_id: localStorage.getItem('id') });
  }


  sectionScrlTop() {
    const $target = $('.direct-chat-messages');
    if ($target[0] != undefined && $target[0].scrollHeight != undefined) {
      $target.animate({ scrollTop: $target[0].scrollHeight }, 500);
    }
  }

  getGroupChatMsgs() {
    this.showLoader = true;
    this.pagenumber = 0;
    const pageno = this.pagenumber;
    this.groupchatService.getGroupchatMsg(this.group_id, pageno, this.isbottom).then(response => {
      this.showLoader = false;
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
      if (response.countNum != undefined && response.countNum > 0) {
        this.openscrollBlue()
      } else {
        this.openscroll()
      }
    });
  }

  getmoredata() {
    console.log('--load--')
    const pageno = this.pagenumber + 1;
    this.pagenumber = pageno;
    this.showLoader = true;
    this.groupchatService.getGroupchatMsg(this.group_id, pageno, this.isbottom).then(response => {
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
      // this.openscroll()
    });
  }

  UriphiMe(text) {
    var exp = /(\b((https?|ftp|file):\/\/|(www))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]*)/ig;
    return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
  }

  delteteUserFromGroup(data) {
    this.deleteuserfromgroupdata = data
    this.deleteuserfromgroupdataName = data.user_id.email
  }

  delete(data) {
    this.groupchatService.deleteGroupUser(data._id).then(response => {
      if (response.status == 'success') {
        this.socket.emit('deleteUserfromGroup', data)
        jQuery('#deleteUserFromGroupCross').modal('hide');
        this.getGropUsers();
        if (localStorage.getItem('current_group_id') == data.group_id && this.logeduserId == data.user_id._id) {
          this.router.navigate(['/groups']);
        }
        $('.alert').css('z-index', '9999');
        $('#error-alert-user-delete').fadeTo(2000, 500).slideUp(500, function () {
          $('#error-alert-user-delete').slideUp(500);
          $('.alert').css('z-index', '-1000');
        });
      }
    });
  }

  DeleteFun(obj) {
    this.groupchatService.deleteMsgFun(obj._id).then(msg => {
      if (msg.status == "success") {
        jQuery('#groupMsgDeleteModel').modal('hide');
        this.socket.emit('emitDeletedGroupMsg', obj)
        this.getGroupChatMsgs()
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

  Pdelt(msg) {
    this.msgInfo = this.msgInfo1
    this.replyPrivate = this.msgInfo1
    const $target = $('.content-wrapper');
    $target.animate({ scrollTop: $target[0].scrollHeight }, 500);
    this.sectionScrlTop();
    // console.log('---------',msg,localStorage.getItem('id'))
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

  ngOnDestroy() {
    // this.groupsService.updateGroupNotificationFromGchat(localStorage.getItem('id')
    //   , this.group_id5).then(response => {

    //   });
    this.group_id5 = ''
  }

  onScroll(data) {
    // console.log('--------+++++++++++++---------------')
    this.pagenumber = 0;
    const pageno = this.pagenumber;
    this.isbottom = this.isbottom + 1;
    // setTimeout(() => {
    // this.groupsService.updateGroupNotificationFromGchat(localStorage.getItem('id')
    // , this.group_id5).then(response => {
    this.groupchatService.getGroupchatMsg(this.group_id, pageno, this.isbottom).then(response => {
      this.chathistory = response.result;
      if (data == true) {
        if (response.result.length >= response.countNum) {
          this.msgcount = response.countNum
          console.log('========nani=============')
          this.groupsService.updateGroupNotificationFromGchat(localStorage.getItem('id')
            , this.group_id5).then(response => {
              this.msgcount = 0
            })
        }
      }

      this.commonFun(this.msgcount, response.countNum)
    })
    // });
    // }, 500);
  }

  commonFun(Main, Child) {
    this.pagenumber = 0;
    const pageno = this.pagenumber;
    // this.groupchatService.getGroupchatMsg(this.group_id, pageno).then(response => {
    // this.msgcount = response.result.length;

    // this.msgcount = 0;

    // this.chathistory = response.result;
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
      element.msg_blue = false
      if (Main >= Child) {
        element.msg_unread = false
      }
    });
    // if (response.countNum != undefined && response.countNum > 0) {
    //   this.openscrollBlue()
    // } else {
    this.openscroll()
    // }
    // });
  }
}