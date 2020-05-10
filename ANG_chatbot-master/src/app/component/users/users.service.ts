import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpService } from '../../http.service';
import { ConstantApi } from '../../app.constantAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CategoryAddModel } from '../../types/category';
@Injectable()
export class UsersService {

  private getAllUserslist = 'user';
  private addUser = 'adduser/to/company';
  private userRoles = 'get/masterData/roles'
  private updateUser = 'user/';
  private deleteUser = 'user/';
  private particularUserCompany = 'company/particular/'
  private getCompanyUsers = 'users/'


  data: CategoryAddModel[];

  constructor(private http: Http, private httpcaller: HttpService) { }


  usersList() {
    return this.httpcaller.httpcall(this.getAllUserslist, 'get');
  }
  addNewUser(data) {
    return this.httpcaller.httpformdatacall(this.addUser, 'post', data);
  }
  userRolesapi() {
    return this.httpcaller.httpcall(this.userRoles, 'get');
  }
  UpdateUser(Id,data) {
    return this.httpcaller.httpformdatacall(this.updateUser+Id, 'put', data);
  }

  DeletedUser(Id) {
    return this.httpcaller.httpformdatacall(this.deleteUser+Id, 'delete');
  }

  userRelatedCompany(Id) {
    return this.httpcaller.httpformdatacall(this.particularUserCompany+Id, 'get');
  }

  CompanyRelatedUsers(Id) {
    return this.httpcaller.httpformdatacall(this.getCompanyUsers+Id, 'get');
  }
  
}
