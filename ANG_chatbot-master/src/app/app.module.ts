import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, AfterViewInit, ElementRef } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticateGuard } from './gaurds/authenticate.guard';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { SidepanelComponent } from './component/sidepanel/sidepanel.component';
import { AuthenticationService } from './component/login-page/login.service';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { LoginPageComponent } from './component/login-page/login-page.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HttpService } from './http.service';
import { Pipe, PipeTransform } from '@angular/core';
import { MyDatePickerModule } from 'mydatepicker';
import { DataTableModule } from 'angular2-datatable';
import { ProfileComponent } from './component/profile/profile.component';
import { ModalModule } from 'ngx-modialog';
import { ProfileService } from './component/profile/profile.service';
import { HeaderService } from './component/header/header.service';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgxDeleteConfirmModule } from 'ngx-delete-confirm';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { NgxSmartModalModule } from 'ngx-smart-modal';



import { DashboardService } from './component/dashboard/dashboard.service';
import { ChathistoryService } from './component/chathistory/chathistory.service';
import { NewuserService } from './component/newuser/newuser.service';
import { SidepanelserviceService } from './component/sidepanel/sidepanelservice.service';
import { ForgotpasswordserviceService } from './component/forgotpassword/forgotpasswordservice.service';
import { CompanyService } from './component/comapny/company.service';
import { UsersService } from './component/users/users.service';
import { GroupsService } from './component/groups/groups.service';
import { GroupchatService } from './component/groupchat/groupchat.service';
import { AllchatserviceService } from './component/allchats/allchatservice.service';


import { ChathistoryComponent } from './component/chathistory/chathistory.component';
import { NewuserComponent } from './component/newuser/newuser.component';
import { ForgotpasswordComponent } from './component/forgotpassword/forgotpassword.component';

import { Getseleteddata } from './app.commonValue';
import { Bannneddata } from './app.commonValue';
import { SecondsToTimePipe, TruncatePipe } from './app.commonValue';
import { Chatroutering } from './app.commonValue';
import { ComapnyComponent } from './component/comapny/comapny.component';
import { UsersComponent } from './component/users/users.component';
import { GroupsComponent } from './component/groups/groups.component';
import { GroupchatComponent } from './component/groupchat/groupchat.component';
import { PagerService } from './component/users/pagerService';
import { AllchatsComponent } from './component/allchats/allchats.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidepanelComponent,
    DashboardComponent,
    LoginPageComponent,
    ProfileComponent,
    ChathistoryComponent,
    NewuserComponent,
    ForgotpasswordComponent,
    SecondsToTimePipe,
    TruncatePipe,
    ComapnyComponent,
    UsersComponent,
    GroupsComponent,
    GroupchatComponent,
    AllchatsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MyDateRangePickerModule,
    Ng2SearchPipeModule,
    MyDatePickerModule,
    ReactiveFormsModule,
    DataTableModule,
    Ng2OrderModule,
    NgxDeleteConfirmModule.forRoot(),
    ModalModule.forRoot(),
    InfiniteScrollModule,
    NgxSmartModalModule.forRoot()
  ],



  providers: [AuthenticationService,
    AuthenticateGuard,
    ProfileService,
    HttpService,
    HeaderService,
    DashboardService,
    ChathistoryService,
    NewuserService,
    SidepanelserviceService,
    ForgotpasswordserviceService,
    Getseleteddata,
    Chatroutering,
    CompanyService,
    UsersService,
    GroupsService,
    GroupchatService,
    PagerService,
    AllchatserviceService
  ],

  bootstrap: [AppComponent],

})
export class AppModule {

}
