
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpService } from '../../http.service';
import { ConstantApi } from '../../app.constantAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Login } from '../../types/login';
import { Constant } from '../../app.constant';
import * as io from 'socket.io-client';
// declare var jQuery: any;


declare var $: any;

@Injectable()
export class AuthenticationService {
  socket: SocketIOClient.Socket;
  private apiurl = 'user/login';
  private forgotPassword = 'user/forgotPassword';
  data: Login[];
  showLoader = false;

  constructor(private http: HttpClient, private httpcaller: HttpService, private router: Router) {
    this.socket = io.connect(Constant.url);
  }

  private tokenUrl = Constant.url + 'login';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  // login(login): Observable<any> {
  //   const data = { ...login };
  //   return();
  // }
  // login(login: Login): Observable<any> {
  //   const data = { ...login };
  //   return this.http.post<Login>(this.tokenUrl, data, { headers: this.headers, observe: 'response' });
  // }
  loginapicall(data) {
    return this.httpcaller.httpformdatacall(this.apiurl, 'post', data);
  }

  forgotPasswordapi(data) {
    return this.httpcaller.httpformdatacall(this.forgotPassword, 'post', data);
  }

  logout() {
    // remove user from local storage to log user out
    this.showLoader = false;
    this.socket.emit('userLoggedOut',localStorage.getItem('id'));
    localStorage.removeItem('auth');
    localStorage.setItem('istyping', '');
    localStorage.removeItem('id');
    localStorage.removeItem('userinfo');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('displayName');
    localStorage.removeItem('online');
    localStorage.removeItem('current_group_id')
    // jQuery('#msgDeleteModel').modal('hide');
    this.router.navigate(['/login']);
  }
}
