import { Component, OnInit, Pipe } from '@angular/core';
import { GroupsService } from './groups.service';
import { GroupchatService } from '../groupchat/groupchat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { Constant } from '../../app.constant';
import { PagerService } from '../users/pagerService'
import * as io from 'socket.io-client';
declare var jQuery: any;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  socket: SocketIOClient.Socket;
  response = [];
  private body = '';
  showLoader = false;
  errMsg: string;
  public ShowToError = false;
  countohistoryusers: number = 0;
  GroupCount:number = 0;
  private grouplist: any = [];
  private invitedgrouplist: any = [];
  private companyList: any = [];
  private group: any = {};
  public security: any = [];
  private userToken: string;
  private logeduserId: string;
  public person: any = {};
  public showfields = false;
  public role;
  key: string;
  private allItems: any[];
  testId;
  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];
  constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private groupsService: GroupsService, private pagerService: PagerService,
    private groupchatService: GroupchatService) {
    this.socket = io.connect(Constant.url)
  }

  ngOnInit() {
    document.title = 'New User';
    this.showLoader = true;
    this.userToken = this.route.snapshot.params['id'];
    this.logeduserId = localStorage.getItem('id');
    this.role = localStorage.getItem('role');
    this.selectName();
    this.masterList();
    this.getusercompanies();
    this.groupsList();
    this.invitedGroups();
    //   this.route.params.subscribe(paramsId => {
    //     this.testId = paramsId.id;
    // });

    this.socket.on('groupNotificationEmit', (data: any) => {
      let userArr = []
      this.invitedgrouplist.forEach(element => {
        if (element.group_id._id == data.group_id) {
          // element.group_noti_count = data.group_noti_count
          if (localStorage.getItem('role') == 'ADMIN') {
            this.privategroups();
          } else {
            this.publicGroups();
          }
        }
        // userArr.push(element)
      });
      // this.invitedgrouplist = userArr
    });

    this.socket.on('sendInvitationToUser', (data: any) => {
      if (data.result.user_id._id == this.logeduserId) {
        this.invitedgrouplist.push(data.result)
        this.GroupCount = this.invitedgrouplist.length
        this.publicGroups();
      }
    });

    this.socket.on('publicGroupListEmit', (data: any) => {
      if (data.created_by != this.logeduserId) {
        this.publicGroups();
        // this.privategroups();
      }
    });
    
    this.socket.on('privateGroupListEmit', (data: any) => {
      if (localStorage.getItem('role') == 'ADMIN') {
        this.privategroups();
      }
    });
    

    this.socket.on('deleteUserfromGroupListEmit', (msg: any) => {
     
      let usrArrList = []
      this.invitedgrouplist.forEach(element => {
        if (element._id != msg._id) {
          usrArrList.push(element)
        }
        this.invitedgrouplist = usrArrList
        this.GroupCount = this.invitedgrouplist.length
      });
      this.emitDeletedUsers(msg)
      if (localStorage.getItem('current_group_id') == msg.group_id && this.logeduserId == msg.user_id._id) {
        this.router.navigate(['/groups']);
      }
      localStorage.removeItem('current_group_id')
    })


    this.socket.on('deleteUserfromGroupListEmitlist', (msg: any) => {
      // if(this.logeduserId != msg.user_id._id){
        this.publicGroups()
      // }
      this.emitDeletedUsers(msg)
      // console.log('-------------,',localStorage.getItem('current_group_id') ,msg.group_id, this.logeduserId , msg.user_id._id)
      if (localStorage.getItem('current_group_id') == msg.group_id._id) {
        this.router.navigate(['/groups']);
      }
      localStorage.removeItem('current_group_id')
    })
  }

  emitDeletedUsers(msg) {
    this.socket.emit('deltedUserRefreshUsersListinGroup', msg)
  }

  createGroup(inputs) {
    inputs.created_by = localStorage.getItem('id');
    this.groupsService.craeteGroup(inputs).then(group => {
      if (inputs.type == 'public') {
        this.socket.emit('publicGroup', group)
      }else{
        this.socket.emit('privateGroup', group)
      }
      if (group.status == 'success') {
        this.group = {}
        $('#success-alert-group').css('z-index', '9999');
        $('#success-alert-group').fadeTo(2000, 500).slideUp(500, function () {
          $('#success-alert-group').slideUp(500);
          $('.alert').css('z-index', '-1000');
        });
        jQuery('#groupModal').modal('hide');
        if (localStorage.getItem('role') == 'ADMIN') {
          this.groupsList();
        } else {
          this.invitedGroups();
        }

      }else{
        // some fields are missing
        $('.alert').css('z-index', '9999');
        $('#error-alert').fadeTo(2000, 500).slideDown(500, function () {
            $('#error-alert').slideDown(500);
            $('.alert').css('z-index', '-1000');
        });
       }
    });
  }
  masterList(): void {
    this.security = [{
      value: 'public'
    }, {
      value: 'private'
    }];
  }
  selectName() {
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.invitedgrouplist = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  invitedGroups() {
    this.showLoader = true;
    this.groupsService.getInvitedGroups(localStorage.getItem('id')).then(groups => {
      if (groups.status == 'success') {
        this.showLoader = false;
        this.invitedgrouplist = groups.result;
        this.GroupCount = groups.result.length
        this.allItems = groups.result;
        // initialize to page 1
        this.setPage(1);
      }
    })
  }


  publicGroups(){
    this.groupsService.getInvitedGroups(localStorage.getItem('id')).then(groups => {
      if (groups.status == 'success') {
        this.invitedgrouplist = groups.result;
        this.GroupCount = groups.result.length
        this.allItems = groups.result;
        this.setPage(1);
      }
    })
  }

  privategroups(){
    this.groupsService.allGroups().then(groups => {
      if (groups.status == 'success') {
        this.grouplist = groups.result;
        this.allItems = groups.result;
        this.GroupCount = groups.result.length
        this.setPage(1);
      }
    })
  }

  groupsList(): void {
    this.showLoader = true;
    if (localStorage.getItem('role') == 'ADMIN') {
      this.groupsService.allGroups().then(groups => {
        if (groups.status == 'success') {
          this.showLoader = false;
          this.grouplist = groups.result;
          this.allItems = groups.result;
          this.GroupCount = groups.result.length
          // initialize to page 1
          this.setPage(1);
        }
      })
    }
    // else {
    //   this.groupsService.getCreatedGroups(localStorage.getItem('id')).then(groups => {
    //     if (groups.status == 'success') {
    //       this.showLoader = false;
    //       this.grouplist = groups.result;
    //       this.allItems = groups.result;

    //       // initialize to page 1
    //       this.setPage(1);
    //     }
    //   })
    // }
  }
  getusercompanies() {
    this.showLoader = true;
    this.groupsService.userRelatedCompany(localStorage.getItem('id')).then(company => {
      if (company.status == 'success') {
        this.showLoader = false;
        this.companyList = company.result;
      }
    })
  }
  editGroup(id, group) {
    this.groupsService.UpdateGroup(id, group).then(response => {
      $('.alert').css('z-index', '9999');
      $('#group-updated-alert').fadeTo(2000, 500).slideUp(500, function () {
        $('#group-updated-alert').slideUp(500);
        $('.alert').css('z-index', '-1000');
      });
    });
    group.pencil = false;
    group.hideinputbox = undefined;
    this.groupsList();
  }

  openedit(x) {
    // console.log("-------open-----", x)
    this.grouplist.forEach(element => {
      if (element.group_id._id === x._id) {
        element.hideinputbox = false;
        element.pencil = true;
      }
    });
  }
  openeInviteddit(x) {
    // console.log("-------open-----", x)
    this.invitedgrouplist.forEach(element => {
      if (element.group_id._id === x._id) {
        element.hideinputbox = false;
        element.pencil = true;
      }
    });
  }

  editInvitedGroup(id, group) {
    this.groupsService.UpdateGroup(id, group).then(response => {
      $('.alert').css('z-index', '9999');
      $('#group-updated-alert').fadeTo(2000, 500).slideUp(500, function () {
        $('#group-updated-alert').slideUp(500);
        $('.alert').css('z-index', '-1000');
      });
    });
    group.pencil = false;
    group.hideinputbox = undefined;
    this.invitedGroups();
  }
  private sendCancel($event: any): void {
  }

  private sendDelete($event: any, i,y): void {
    const index = this.response.indexOf(i);
    const body = { isDelete: true };
    this.groupsService.DeletedGroup(i).then(response => {
      this.groupsList();
      this.socket.emit('deleteUserfromGroupData',y)

      //  this.invitedgrouplist =this.invitedgrouplist

      // console.log(i, 'index');
      // this.groupsList();
    });
    $('.alert').css('z-index', '9999');
    $('#error-alert-group-delete').fadeTo(2000, 500).slideUp(500, function () {
      $('#error-alert-company-delete').slideUp(500);
      $('.alert').css('z-index', '-1000');
    });
  }


  updateNotification(id) {
    // this.groupsService.updateGroupNotification(id._id).then(response => {

    // });
    this.socket.emit('messageIsRededByUserIGroup', { group_id: id.group_id._id, sendr_id: localStorage.getItem('id') });
  }

  delete(data) {
    this.groupchatService.deleteGroupUser(data._id).then(response => {
      if (response.status == 'success') {
        this.socket.emit('deleteUserfromGroup', data)
        this.invitedGroups();
        $('.alert').css('z-index', '9999');
        $('#error-alert-user-delete').fadeTo(2000, 500).slideUp(500, function () {
          $('#error-alert-user-delete').slideUp(500);
          $('.alert').css('z-index', '-1000');
        });
      }
    });
  }

  muteNotification(data) {
    this.groupsService.MuteNotifications(data._id,{isMute:true}).then(response => {
      if (response.status == 'success') {
        this.invitedgrouplist.forEach(element => {
          if(data._id === element._id){
            element.isMute = true
          }
        });
        // this.invitedgrouplist
        $('.alert').css('z-index', '9999');
        $('#warning-alert').fadeTo(2000, 500).slideUp(500, function () {
          $('#warning-alert').slideUp(500);
          $('.alert').css('z-index', '-1000');
        });
      }
    });
  }

  unMuteNotification(data) {
    this.groupsService.MuteNotifications(data._id,{isMute:false}).then(response => {
      if (response.status == 'success') {
        this.invitedgrouplist.forEach(element => {
          if(data._id === element._id){
            element.isMute = false
          }
        });
        $('.alert').css('z-index', '9999');
        $('#un-warning-alert').fadeTo(2000, 500).slideUp(500, function () {
          $('#un-warning-alert').slideUp(500);
          $('.alert').css('z-index', '-1000');
        });
      }
    });
  }

  
}
