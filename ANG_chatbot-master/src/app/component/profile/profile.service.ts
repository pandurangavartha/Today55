import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable  } from 'rxjs/Observable';
import 'rxjs/add/operator/map';



@Injectable()
export class ProfileService {

  constructor(private http:Http) { 
    
  }
  getProducts() {
    const header = new Headers({
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('accessToken')
  });
  const options = new RequestOptions({headers: header});
  const data =  localStorage.getItem('profileId');
  console.log(data,"id")
    return this.http.get('http://192.168.11.71:3000/user/'+data, options)
    .map((response) => {
      console.log(response.json(),'find')

      return response.json();
        //return  userDetails;

    });
  }
  userService(update:any) {
    const header = new Headers({
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('accessToken')
  });
  const options = new RequestOptions({headers: header});
  const data =  localStorage.getItem('profileId');
  
    return this.http.put('http://192.168.11.71:3000/user/'+data,update, options)
    .map((response) => {
      console.log(response.json(),'hey')
      return response.json();
        //return  userDetails;

    });
  }
}
