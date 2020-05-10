import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpService } from '../../http.service';
import { ConstantApi } from '../../app.constantAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CategoryAddModel } from '../../types/category';

@Injectable()
export class SidepanelserviceService {
  private category = 'category';
  data: CategoryAddModel[];

  constructor(private http: Http, private httpcaller: HttpService) { }


  
  // createCategory(data) {
  //   return this.httpcaller.httpformdatacall(this.category, 'post', data);
  // }


}
