import { Component, OnInit } from '@angular/core';
import { UsersService } from './users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PagerService } from './pagerService'
import * as io from 'socket.io-client';
declare var jQuery: any;
import { Constant } from '../../app.constant';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  socket: SocketIOClient.Socket;
  response = [];
  public usersList: any = [];
  public userRoleslist: any = [];
  public UsersCount: number = 0;
  public companyList: any = [];
  public companyListDropDown : any = [];
  public inviteuser: any = {'firstname':''};
  public selectedcompany: any = {};
  public role;
  showLoader = false;
  public company = { name: '', email: '' };
  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  constructor(private router: Router, private route: ActivatedRoute,
    private usersService: UsersService, private pagerService: PagerService) {
    this.socket = io.connect(Constant.url)
  }

  ngOnInit() {
    this.getusersList();
    this.userRoles()
    this.selectName();
    this.getusercompanies();
    this.role = localStorage.getItem('role');
  }
  getusersList(): void {
    if (localStorage.getItem('role') == 'ADMIN') {
      this.showLoader = true;
      this.usersService.usersList().then(user => {
        this.showLoader = false;
        if (user.status == 'success') {
          let DataArr = []
          user.result.forEach(element => {
            if (element.user_id.role_id.title != 'ADMIN') {
              DataArr.push(element)
            }
          });
          this.usersList = DataArr
          this.UsersCount = DataArr.length
          this.allItems = DataArr;

          // initialize to page 1
          this.setPage(1);
        }
      })
    } else {
      this.showLoader = true;
      if (this.companyList.length > 0) {
        this.usersService.CompanyRelatedUsers(this.companyList[0].company_id._id).then(user => {
          if (user.status == 'success') {
            this.showLoader = false;
            let DataArr = []
            user.result.forEach(element => {
              if (element.user_id.role_id.title != 'ADMIN') {
                DataArr.push(element)
              }
            });
            this.usersList = DataArr
            this.UsersCount = DataArr.length
            this.allItems = DataArr;
            // initialize to page 1
            this.setPage(1);
          }
        })
      } else {
        this.showLoader = false;
        this.usersList = [];
        this.UsersCount = 0
      }
    }
  }
  addUser(inviteuser) {
   if(inviteuser.role_id == "5c5eed6c48a8672gccd413c1"){
     delete inviteuser.role_id
   }
   if(inviteuser.company_id == '4'){
    delete inviteuser.company_id
   }
    if (inviteuser.company_id != undefined && inviteuser.role_id != undefined) {
      this.usersService.addNewUser(inviteuser).then(response => {
        if (response.status == 'success') {
          this.socket.emit('userAddedIntoCompany', response)
          $('#success-alert').css('z-index', '9999');
          $('#success-alert').fadeTo(2000, 500).slideUp(500, function () {
            $('#success-alert').slideUp(500);
            $('.alert').css('z-index', '-1000');
          });
          $('#first').val('')
          $('#email').val('')
          $('#pwdfield').val('')
          $('#last').val('')

          $('#first').parent().removeClass('has-success')
          $('#last').parent().removeClass('has-success')
          $('#email').parent().removeClass('has-success')
          $('#pwdfield').parent().removeClass('has-success')
          // this.inviteuser = {}
          this.getusersList();
        } 
        
        if(response.result == 'User alredy Existed'){
          $('.alert').css('z-index', '9999');
          $('#error-alert-user-existed').fadeTo(2000, 500).slideDown(500, function () {
            $('#error-alert-user-existed').slideDown(500);
            $('.alert').css('z-index', '-1000');
          });
        }
      });
    } else {
      $('.alert').css('z-index', '9999');
      $('#error-alert').fadeTo(2000, 500).slideDown(500, function () {
        $('#error-alert').slideDown(500);
        $('.alert').css('z-index', '-1000');
      });
    }
  }

  userRoles(): void {
    this.usersService.userRolesapi().then(userRoles => {
      if (userRoles.status == 'success') {
        let arr = []
        userRoles.result.forEach(element => {
          if (element.title != 'ADMIN') {
            arr.push(element)
          }
          if(element.title == 'Select Role'){
            element._id = "5c5eed6c48a8672gccd413c1"
          }
        });
        arr.reverse()
        this.userRoleslist = arr;
        this.inviteuser.role_id = this.userRoleslist[0]._id
      }
    })
  }
  selectName() {
  }
  changeOnfirstName() {
    console.log(this.usersList[0])
  }
  selectCompany(data) {
    this.showLoader = true;
    this.usersService.CompanyRelatedUsers(this.selectedcompany.company_id).then(user => {
      this.showLoader = false;
      if (user.status == 'success') {
        let DataArr = []
        user.result.forEach(element => {
          if (element.user_id.role_id.title != 'ADMIN') {
            DataArr.push(element)
          }
        });
        this.usersList = DataArr
        this.UsersCount = DataArr.length
        this.allItems = DataArr;
        // initialize to page 1
        this.setPage(1);
      }
    })
  }
  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.usersList = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  editUser(id, user) {
    this.usersService.UpdateUser(id._id, user).then(response => {
      this.showLoader = false;
      $('.alert').css('z-index', '9999');
      $('#updated-alert').fadeTo(2000, 500).slideUp(500, function () {
        $('#updated-alert').slideUp(500);
        $('.alert').css('z-index', '-1000');
      });
    });
    user.pencil = false;
    user.hideinputbox = undefined;
    user.showbox = undefined;
    // if((localStorage.getItem('role') == 'ADMIN')){
    this.getusersList();
    // }else{
    // this.selectCompany({});
    // this.getusercompanies() 
    // }

  }

  openedit(x) {
    this.usersList.forEach(element => {
      if (element.user_id._id === x._id) {
        element.hideinputbox = false;
        element.showbox = false;
        element.pencil = true;
      }
    });
  }

  private sendCancel($event: any): void {
  }

  private sendDelete($event: any, i): void {
    const index = this.response.indexOf(i._id);
    const body = { isDelete: true };
    this.usersService.DeletedUser(i._id).then(response => {
      this.socket.emit('deltedUserChtWindownRefresh', index)
      this.usersList.splice(index, 1);
      this.getusersList();
      this.showLoader = false;
    });
    $('.alert').css('z-index', '9999');
    $('#error-alert-user-delete').fadeTo(2000, 500).slideUp(500, function () {
      $('#error-alert-user-delete').slideUp(500);
      $('.alert').css('z-index', '-1000');
    });
  }

  getusercompanies() {
    this.usersService.userRelatedCompany(localStorage.getItem('id')).then(company => {
      if (company.status == 'success') {
        this.companyList = company.result;
        this.selectedcompany.company_id = this.companyList[0].company_id._id
        this.companyListDropDown = company.result;
        this.companyListDropDown.reverse()
        this.inviteuser.company_id = this.companyListDropDown[0].company_id._id
      }
    })
  }

}
