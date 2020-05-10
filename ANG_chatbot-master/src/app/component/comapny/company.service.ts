import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpService } from '../../http.service';
import { ConstantApi } from '../../app.constantAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CategoryAddModel } from '../../types/category';

@Injectable()
export class CompanyService {
  private companyGetUrl = 'company/get';
  private updateCompany = 'company/edit/';
  private addcompany = 'company/create';
  private deleteCompany = 'company/delete/';
  private particularUserCompanies = 'company/particular/'
  private getcompanyUserDetails = 'users/company/';

  data: CategoryAddModel[];

  constructor(private http: Http, private httpcaller: HttpService) { }


  companyGetList() {
    console.log(this.companyGetUrl,'hii',);
    return this.httpcaller.httpcall(this.companyGetUrl, 'get');
  }
  addNewCompany(data) {
    return this.httpcaller.httpformdatacall(this.addcompany, 'post', data);
  }

  UpdateCompany(Id,data) {
    return this.httpcaller.httpformdatacall(this.updateCompany+Id, 'put', data);
  }

  DeletedCompany(Id) {
    return this.httpcaller.httpformdatacall(this.deleteCompany+Id, 'delete');
  }

  userRelatedCompanies(Id) {
    return this.httpcaller.httpformdatacall(this.particularUserCompanies+Id, 'get');
  }

  getcompanyuserlist(Id) {
    return this.httpcaller.httpformdatacall(this.getcompanyUserDetails+Id, 'get');
  }
  
}
