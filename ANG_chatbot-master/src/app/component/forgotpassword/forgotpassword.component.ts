import { Component, OnInit, Pipe } from '@angular/core';
import { ForgotpasswordserviceService } from './forgotpasswordservice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { Constant } from '../../app.constant';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  response = [];
  private body = '';
  showLoader = false;
  errMsg: string;
  public ShowToError = false;
  countohistoryusers: number = 0;
  private Invitedsers: any = [];
  private storeusers: any = [];
  private inviteuser: any = {};
  private userToken: string;
  public person: any = {};
  public showfields = true;
  key: string;

  constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private NewuserServiceapis: ForgotpasswordserviceService) {
  }

  ngOnInit() {
    document.title = 'New User';
    this.showLoader = true;
    this.userToken = this.route.snapshot.params['id'];
  }



  getVistedUsers(): void {

  }

  onFormSubmit() {
    this.person._id = this.userToken;
    if (this.person.password === this.person.conformpassword) {
      this.NewuserServiceapis.newusersavedata(this.person).then(user => {
        if(user.message === "code not matched"){
          $('.alert').css('z-index', '9999');
          $('#error-alert-code-existed').fadeTo(2000, 500).slideDown(500, function () {
            $('#error-alert-code-existed').slideDown(500);
            $('.alert').css('z-index', '-1000');
          });
        }
        if(user.message === "password not matched"){
          $('.alert').css('z-index', '9999');
          $('#error-alert-miss-password').fadeTo(2000, 500).slideDown(500, function () {
              $('#error-alert-miss-password').slideDown(500);
              $('.alert').css('z-index', '-1000');
          });
        }

        if(user.message === "fields not null"){
          $('.alert').css('z-index', '9999');
          $('#error-alert').fadeTo(2000, 500).slideDown(500, function () {
              $('#error-alert').slideDown(500);
              $('.alert').css('z-index', '-1000');
          });
        }
        
        if (user.status=='success') {
          this.showLoader = false;
          this.router.navigate(['/login']);
          // this.person.email = user.data.email;
        }
        if(user.status=='false'){
          $('.alert').css('z-index', '9999');
          $('#error-alert-user-existed').fadeTo(2000, 500).slideDown(500, function () {
            $('#error-alert-user-existed').slideDown(500);
            $('.alert').css('z-index', '-1000');
          });
        }
      });
    } else {
      alert('new password & conform passwords not matched')
    }
  }

 
      // else {
      //   $('.alert').css('z-index', '9999');
      //   $('#error-alert').fadeTo(2000, 500).slideDown(500, function () {
      //     $('#error-alert').slideDown(500);
      //     $('.alert').css('z-index', '-1000');
      //   });
      // }
    // , err => {
    //   this.ShowToError = true;
    //   this.errMsg = err.error.msg;
    // }
  

}
