
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpService } from '../../http.service';
import { ConstantApi } from '../../app.constantAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CategoryAddModel } from '../../types/category';

@Injectable()
export class NewuserService {
  private newusersave = 'user/register';
  private userRolesList = 'get/masterData/roles'
  data: CategoryAddModel[];

  constructor(private http: Http, private httpcaller: HttpService) { }


  // getVistedUsersList() {
  //   return this.httpcaller.httpcall(this.newusersave, 'get');
  // }

  newusersavedata(data) {
    return this.httpcaller.httpcall(this.newusersave, 'post', data);
  }

  userRolesApi() {
    return this.httpcaller.httpcall(this.userRolesList, 'get');
  }

}
