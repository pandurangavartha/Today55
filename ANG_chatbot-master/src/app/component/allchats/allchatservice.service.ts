import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpService } from '../../http.service';
import { ConstantApi } from '../../app.constantAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CategoryAddModel } from '../../types/category';

@Injectable()
export class AllchatserviceService {
  private messagesListUrl = 'messages/get/';
  private msgSend = 'messages/send';
  private getAllUsers = 'user';
  private particularUserCompany = 'company/particular/';
  private getCompanyUsers = 'users/'
  private allcompanyGetUrl = 'company/get';
  private imageSend = 'images/send';
  private notificationUpdate = 'notification/';
  private sndrRecrMsgCunt = 'messages/count/';
  private deleteMsg = 'messages/delete/';
  private anotherList = 'msg/get/users/';
  private messagesListUrlAdmin = 'messages/get/admin/access/'

  data: CategoryAddModel[];

  constructor(private http: Http, private httpcaller: HttpService) { }


  anotherRecrList(Id) {
    if (Id != undefined && Id != null && Id != '') {
      return this.httpcaller.httpcall(this.anotherList + Id, 'get');
    }
  }
  getMessagesListAdmin(Id,rId){
    if (Id != undefined && Id != null && Id != '') {
      return this.httpcaller.httpcall(this.messagesListUrlAdmin + Id +'/'+rId, 'get');
    }
  }

  getMessagesList(Id) {
    if (Id != undefined && Id != null && Id != '') {
      return this.httpcaller.httpcall(this.messagesListUrl + Id, 'get');
    }
  }
  msgSendToUser(data) {
    return this.httpcaller.httpformdatacall(this.msgSend, 'post', data);
  }
  imageSendToUser(data) {
    return this.httpcaller.httpformdatacall(this.imageSend, 'post', data);
  }
  listAllUsers() {
    return this.httpcaller.httpcall(this.getAllUsers, 'get');
  }
  userRelatedCompany(Id) {
    return this.httpcaller.httpformdatacall(this.particularUserCompany + Id, 'get');
  }
  CompanyRelatedUsers(Id) {
    return this.httpcaller.httpformdatacall(this.getCompanyUsers + Id, 'get');
  }

  allcompanyGetList() {
    return this.httpcaller.httpcall(this.allcompanyGetUrl, 'get');
  }

  notificationsUpdate(sndr,recr) {
    return this.httpcaller.httpformdatacall(this.notificationUpdate + sndr+'/'+recr, 'get');
  }

  sndrRecrMsgCuntInfo(sndr,recr) {
    return this.httpcaller.httpformdatacall(this.sndrRecrMsgCunt + sndr + '/'+recr, 'get');
  }

  deleteMsgFun(id) {
    return this.httpcaller.httpformdatacall(this.deleteMsg + id , 'delete');
  }

}
