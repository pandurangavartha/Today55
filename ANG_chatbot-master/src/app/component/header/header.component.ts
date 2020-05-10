import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { HeaderService } from '../header/header.service';
import { AuthenticationService } from '../login-page/login.service';
import { Overlay } from 'ngx-modialog';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
declare var jQuery: any;

import { fadeInAnimation } from '../../_animations/index';


@Component({
  selector: 'app-header',
  moduleId: module.id.toString(),
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})


export class HeaderComponent implements OnInit {
  model;
  public userdetails: any = [];
  public userName;
  public user = { email: '', firstName: '', lastName: '', displayname: '' };
  public person = { password: '', conformpassword: '',_id:'',oldpassword:''};
  constructor(private htpservice: HeaderService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router) { }
  ngOnInit() {
    this.userName = localStorage.getItem('email')
  }

  logOut() {
    this.authService.logout();
  }

  getuser() {
    const user_id = localStorage.getItem('id');
    // this.htpservice.getuserstatus(user_id).then(response => {
    //   this.userdetails = response.data;
    // });
  }
  onlinetooffline(online1) {
    // this.htpservice.updateUserdata(online1).then(response => {
    //   localStorage.setItem('online', response.data.online);
    //   if (response.success) {
    //     //  console.log('++++++123+++++', response.data)
    //     localStorage.setItem('online', response.data.online);
    //   }
    // });
  }

  profile() {
    // const data = localStorage.getItem('userinfo');
    const email = localStorage.getItem('email');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const displayname = localStorage.getItem('displayName');
    this.user.email = email;
    this.user.firstName = firstName;
    this.user.lastName = lastName;
    this.user.displayname = displayname;

  }
  resetUsersData(user) {
    user._id = localStorage.getItem('id');
    localStorage.setItem('displayName', user.displayname);
    localStorage.setItem('firstName', user.firstName);
    localStorage.setItem('lastName', user.lastName);
    user.firstname = user.firstName
    user.lastname = user.lastName
    this.htpservice.updateUserdataapi(user._id, user).then(response => {
      if (response.status == 'success') {
        jQuery('#myModal').modal('hide');
      }
    });
  }

  changePassword() {
    this.person._id = localStorage.getItem('id')
    if (this.person.password === this.person.conformpassword) {
      this.htpservice.changePasswordApi(this.person).then(response => {
        if (response.status == 'success') {
          this.person = { password: '', conformpassword: '',_id:'',oldpassword:''};
          jQuery('#changePassword').modal('hide');
        }else{
          if(response.message == "password miss matched"){
            $('.alert').css('z-index', '9999');
            $('#error-alert-miss-password').fadeTo(2000, 500).slideDown(500, function () {
                $('#error-alert-miss-password').slideDown(500);
                $('.alert').css('z-index', '-1000');
            });
          }else{
            $('.alert').css('z-index', '9999');
            $('#error-alert').fadeTo(2000, 500).slideDown(500, function () {
                $('#error-alert').slideDown(500);
                $('.alert').css('z-index', '-1000');
            });
          }
        }
      });
    } else {
      alert('new password & conform passwords not matched')
    }
  }
}
