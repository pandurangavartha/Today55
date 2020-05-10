import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpService } from '../../http.service';
import { ConstantApi } from '../../app.constantAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CategoryAddModel } from '../../types/category';

@Injectable()
export class ForgotpasswordserviceService {
  private updatePassword = 'user/updatePassword';
  private product = 'products';
  private inviteusertoken = 'api/v1/user/tokenvalidation';
  data: CategoryAddModel[];

  constructor(private http: Http, private httpcaller: HttpService) { }


  // getVistedUsersList() {
  //   return this.httpcaller.httpcall(this.newusersave, 'get');
  // }

  newusersavedata(data) {
    return this.httpcaller.httpcall(this.updatePassword, 'post',data);
  }

  inviteNewusertokencheck(data) {
    return this.httpcaller.httpformdatacall(this.inviteusertoken, 'post', data);
  }

}
//api/v1/vistedUsers