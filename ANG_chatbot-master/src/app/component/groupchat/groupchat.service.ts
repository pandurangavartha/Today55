import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpService } from '../../http.service';
import { ConstantApi } from '../../app.constantAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CategoryAddModel } from '../../types/category';

@Injectable()
export class GroupchatService {
  private getAllUserslist = 'user';
  private getUserDetails = 'user/';
  private addUserToGroup = 'add/user/to/group';
  private getGroupDetails = 'group/';
  private getGroupUsersList = 'ger/userlist/';
  private getGroupChat = 'get/groupchat/';
  private imageSend = 'images/send';
  private getCompanyUsers = 'users/';
  private deletegroupUser = 'delete/group/user/';
  private deleteMsg = 'messages/delete/'

  constructor(private http: Http, private httpcaller: HttpService) { }
  usersList() {
    return this.httpcaller.httpcall(this.getAllUserslist, 'get');
  }
  userDetails(id) {
    return this.httpcaller.httpcall(this.getUserDetails + id, 'get');
  }

  getGroupdetails(id) {
    return this.httpcaller.httpcall(this.getGroupDetails + id, 'get');
  }
  addNewuserToGroup(data) {
    return this.httpcaller.httpformdatacall(this.addUserToGroup, 'post', data);
  }
  getGroupUserslist(id) {
    return this.httpcaller.httpcall(this.getGroupUsersList + id, 'get');
  }
  getGroupchatMsg(id,pageno,isbottom) {
    return this.httpcaller.httpcall(this.getGroupChat + id+'/'+pageno+'/'+isbottom, 'get');
  }
  imageSendToUser(data){
    return this.httpcaller.httpformdatacall(this.imageSend, 'post', data);
  }
  CompanyRelatedUsers(Id) {
    return this.httpcaller.httpformdatacall(this.getCompanyUsers+Id, 'get');
  }
  deleteGroupUser(id) {
    return this.httpcaller.httpformdatacall(this.deletegroupUser+id, 'delete');
  }

  deleteMsgFun(id) {
    return this.httpcaller.httpformdatacall(this.deleteMsg + id , 'delete');
  }
}
