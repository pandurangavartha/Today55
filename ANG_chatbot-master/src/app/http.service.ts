import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import { Constant } from './app.constant';

@Injectable()
export class HttpService {
  constructor(private http: Http) { }
  httpcall(url: string, method: string, data?: any) {
    const header = new Headers({
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('auth')
    });
    const options = new RequestOptions({ headers: header });
    if (method !== 'put' && method !== 'post') {
      return this.http[method](Constant.url + url, options, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    } else {
      return this.http[method](Constant.url + url, data, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
  }
  httpformdatacall(url: string, method: string, data?: any) {
    const header = new Headers({
      'x-access-token': localStorage.getItem('auth')
    });
    const options4 = new RequestOptions({ headers: header });
    if (method !== 'put' && method !== 'post') {
      return this.http[method](Constant.url + url, options4, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    } else {
      return this.http[method](Constant.url + url, data, options4)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
  }
  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  httpformdatacalls(url: string, method: string, data?: any) {
    const header = new Headers({
      'x-access-token': localStorage.getItem('auth')
    });
    const options4 = new RequestOptions({ headers: header });
    if (method !== 'put' && method !== 'post') {
      return this.http[method]('http://chatbot.credencys.com:5656/' + url, options4, data)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    } else {
      return this.http[method]('http://chatbot.credencys.com:5656/' + url, data, options4)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
  }
}
