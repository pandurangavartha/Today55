import { Component, OnInit, Pipe } from '@angular/core';
import { NewuserService } from './newuser.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { Constant } from '../../app.constant';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css']
})
export class NewuserComponent implements OnInit {
  response = [];
  private body = '';
  showLoader = false;
  errMsg: string;
  public ShowToError = false;
  countohistoryusers: number = 0;
  private Invitedsers: any = [];
  private storeusers: any = [];
  private inviteuser: any = {};
  public userRoles: any = [];
  private userToken: string;
  public person: any = {};
  public showfields = false;
  key: string;

  constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private NewuserServiceapis: NewuserService) {
  }

  ngOnInit() {
    document.title = 'New User';
    this.showLoader = true;
    this.userToken = this.route.snapshot.params['id'];
    this.selectName();
    this.RolesList()
  }



  getVistedUsers(): void {

  }

  onFormSubmit(inputs) {
    // this.person.inviteToken = this.userToken;
    this.NewuserServiceapis.newusersavedata(inputs).then(user => {
      if (user.status == 'success') {
        this.person = {}
        this.showLoader = false;
        this.router.navigate(['/login']);
        // this.person.email = user.data.email;
      }
    });
  }
  RolesList(): void {
    this.NewuserServiceapis.userRolesApi().then(userRoles => {
      if (userRoles.status == 'success') {
        this.userRoles = userRoles.result;
      }
    })
  }
  selectName() {
  }

}
