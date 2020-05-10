
import 'rxjs/add/operator/switchMap'; 
import { Component, OnInit } from '@angular/core';

import { ProfileService } from '../profile/profile.service';
import { RouterModule, Routes } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Router } from '@angular/router';

import { fadeInAnimation } from '../../_animations/index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
 
  model;
  isEdit = false;
  constructor(private htpservice: ProfileService,private router:Router) { }
 
  save(id: string): void {
   
 
    delete this.model.password;
    delete this.model.profilepic;
    delete this.model.updatedAt;
    delete this.model.userRole;
    this.htpservice.userService(this.model).subscribe(res => {
  
      this.model = res.result;
     
      
    });
    this.router.navigate(['/dashboard']);

  }
  moveToSecond():void{
    this.router.navigate(['/dashboard']);
  }


  // save(): void {
  //   this.productService.update(this.product)
  //     .then(() => this.goBack());
  // }

  // editBotton(id: string): void{
  //   this.isEdit = true;
  // }

  ngOnInit() {
    // this.modelshow = false;
    
    this.htpservice.getProducts().subscribe(res => {
      console.log(res)
      // this.model=res;
      this.model = res.result;
      // this.modelshow = true;
    });

  }

}



