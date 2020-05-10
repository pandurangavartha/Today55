import { Component, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Login } from '../../types/login';
import { AuthenticationService } from './login.service';
// import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { Constant } from '../../app.constant';
import * as io from 'socket.io-client';
declare var jQuery: any;
declare var $: any;
import { NgxSmartModalService } from 'ngx-smart-modal';


@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
    public forgotpwd;
    public forgotsuccess;
    public popup = false
    public popup_user_Id;
    showLoader = false;
    model: Login = {
        email: '',
        password: ''
    };
    private loading = false;
    public userexists = false
    socket: SocketIOClient.Socket;
    returnUrl: string;

    constructor(private router: Router, private zone: NgZone,
        private route: ActivatedRoute, private authenticationService: AuthenticationService,
        private NgxSmartModalModule1: NgxSmartModalService) {
        this.socket = io.connect(Constant.url);
    }
    ngOnInit() {
        this.showLoader = false;
    }
    login(model) {
        this.showLoader = true;
        this.authenticationService.loginapicall(model).then(users => {
            if (users.success === true) {
                if (users.data.logged_in === true) {
                    this.popup = true
                    jQuery(document).ready(function () {
                        jQuery('#popup_this');
                        //.bPopup()
                    });
                    this.popup_user_Id = users.data._id
                    this.showLoader = false;
                    // this.NgxSmartModalModule1.getModal('myModal').open();
                } else {
                    this.socket.emit('userLoggedIn', users.data);
                    this.socket.emit('logged_in_session', users.data);
                    this.router.navigate(['/dashboard']);
                    const xToken = users.token;
                    localStorage.setItem('auth', users.token);
                    localStorage.setItem('id', users.data._id);
                    localStorage.setItem('userinfo', JSON.stringify(users));
                    localStorage.setItem('email', users.data.email);
                    localStorage.setItem('firstName', users.data.firstname);
                    localStorage.setItem('lastName', users.data.lastname);
                    localStorage.setItem('role', users.data.role_id.title);
                    localStorage.setItem('online', 'true');
                    $('.alert').css('z-index', '9999');
                    $('#success-alert').fadeTo(2000, 500).slideDown(500, function () {
                        $('#success-alert').slideDown(500);
                        $('.alert').css('z-index', '-1000');
                    });
                    
                    const Id = localStorage.getItem('id');
                    this.showLoader = false;
                    
                }
            } else {
                if (users.message === 'Invalid password.') {
                    $('.alert').css('z-index', '9999');
                    $('#error-alert').fadeTo(2000, 500).slideDown(500, function () {
                        $('#error-alert').slideDown(500);
                        $('.alert').css('z-index', '-1000');
                    });
                } else {
                    $('.alert').css('z-index', '9999');
                    $('#error-alert-notExisted').fadeTo(2000, 500).slideDown(500, function () {
                        $('#error-alert-notExisted').slideDown(500);
                        $('.alert').css('z-index', '-1000');
                    });
                }

            }
        });

    }
    cancel() {
        this.popup = false
    }

    login1(model) {
        this.socket.emit('userLoggedOutMultipleAccounts', this.popup_user_Id);
        this.showLoader = true;
        this.authenticationService.loginapicall(model).then(users => {
            if (users.success === true) {
                this.socket.emit('userLoggedIn', users.data);
                this.socket.emit('logged_in_session', users.data);
                this.router.navigate(['/dashboard']);
                const xToken = users.token;
                localStorage.setItem('auth', users.token);
                localStorage.setItem('id', users.data._id);
                localStorage.setItem('userinfo', JSON.stringify(users));
                localStorage.setItem('email', users.data.email);
                localStorage.setItem('firstName', users.data.firstname);
                localStorage.setItem('lastName', users.data.lastname);
                localStorage.setItem('role', users.data.role_id.title);
                localStorage.setItem('online', 'true');
                $('.alert').css('z-index', '9999');
                $('#success-alert').fadeTo(2000, 500).slideDown(500, function () {
                    $('#success-alert').slideDown(500);
                    $('.alert').css('z-index', '-1000');
                });

                const Id = localStorage.getItem('id');
                this.showLoader = false;
            } else {
                this.showLoader = false;
                if (users.message === 'Invalid password.') {
                    $('.alert').css('z-index', '9999');
                    $('#error-alert').fadeTo(2000, 500).slideDown(500, function () {
                        $('#error-alert').slideDown(500);
                        $('.alert').css('z-index', '-1000');
                    });
                } else {
                    $('.alert').css('z-index', '9999');
                    $('#error-alert-notExisted').fadeTo(2000, 500).slideDown(500, function () {
                        $('#error-alert-notExisted').slideDown(500);
                        $('.alert').css('z-index', '-1000');
                    });
                }

            }
        });

    }

    forgotpassword(model) {
        // console.log("-------------", model)
        this.authenticationService.forgotPasswordapi(model).then(users => {
            if (users.message === 'Invalid email') {
                $('.alert').css('z-index', '9999');
                $('#error-alert-notExisted').fadeTo(2000, 500).slideDown(500, function () {
                    $('#error-alert-notExisted').slideDown(500);
                    $('.alert').css('z-index', '-1000');
                });
            }else{
                this.userexists = true
                $('.alert').css('z-index', '9999');
                $('#success-alert-send-msg').fadeTo(2000, 500).slideDown(500, function () {
                    $('#success-alert-send-msg').slideDown(500);
                    $('.alert').css('z-index', '-1000');
                });
            }
        });
    }

}
