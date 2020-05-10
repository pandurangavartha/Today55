import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpService } from '../../http.service';
import { ConstantApi } from '../../app.constantAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CategoryAddModel } from '../../types/category';

@Injectable()
export class GroupsService {
  private newgroup = 'group/create';
  private particularUserCompany = 'company/particular/'
  private allgroups = 'get/allgroups'
  private ownergroups = 'owner/get/groups/'
  private editGroup = 'group/edit/'
  private deleteGroup = 'group/delete/'
  private invitedGroups = 'get/invited/groups/'
  private updateNotification = 'group/notification/update/'
  private muteNotifications = 'mute/notifications/'
  private updateNotificationCount = 'update/group/not/'

  data: CategoryAddModel[];

  constructor(private http: Http, private httpcaller: HttpService) { }

  craeteGroup(data) {
    return this.httpcaller.httpcall(this.newgroup, 'post', data);
  }

  userRelatedCompany(Id) {
    return this.httpcaller.httpformdatacall(this.particularUserCompany + Id, 'get');
  }

  allGroups() {
    return this.httpcaller.httpformdatacall(this.allgroups, 'get');
  }

  getCreatedGroups(uid) {
    return this.httpcaller.httpformdatacall(this.ownergroups + uid, 'get');
  }

  UpdateGroup(id,group) {
    return this.httpcaller.httpformdatacall(this.editGroup + id, 'put',group);
  }

  DeletedGroup(uid) {
    return this.httpcaller.httpformdatacall(this.deleteGroup + uid, 'delete');
  }

  getInvitedGroups(uid) {
    return this.httpcaller.httpformdatacall(this.invitedGroups + uid, 'get');
  }
  updateGroupNotification(id) {
    return this.httpcaller.httpformdatacall(this.updateNotification + id, 'get');
  }

  MuteNotifications(id,mute) {
    return this.httpcaller.httpformdatacall(this.muteNotifications + id, 'put',mute);
  }

  updateGroupNotificationFromGchat(uId,gId) {
    return this.httpcaller.httpformdatacall(this.updateNotificationCount + uId+'/'+gId, 'get');
  }
}
