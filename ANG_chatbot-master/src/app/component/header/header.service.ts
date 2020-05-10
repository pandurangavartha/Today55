import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpService } from '../../http.service';



@Injectable()
export class HeaderService {
  private updateUserData = 'user/';
  private changePassword =  'user/changePassword';
  private getstatus = '';

  constructor(private http: Http, private httpcaller: HttpService) { }
  getProfile() {
    const header = new Headers({
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('accessToken')
    });
    const options = new RequestOptions({ headers: header });

  }

  updateUserdataapi(id,data) {
    return this.httpcaller.httpformdatacall(this.updateUserData + id, 'put', data);
  }

  changePasswordApi(data) {
    return this.httpcaller.httpformdatacall(this.changePassword, 'post', data);
  }

  // getuserstatus(data) {
  //   return this.httpcaller.httpformdatacall(this.getstatus + '/' + data, 'get');
  // }
}
