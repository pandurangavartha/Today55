
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateGuard } from './gaurds/authenticate.guard';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LoginPageComponent } from './component/login-page/login-page.component';
import { ProfileComponent } from './component/profile/profile.component';
import { HeaderComponent } from './component/header/header.component';
import { ChathistoryComponent } from './component/chathistory/chathistory.component';
import { NewuserComponent } from './component/newuser/newuser.component';
import { ForgotpasswordComponent } from './component/forgotpassword/forgotpassword.component';
import { ComapnyComponent } from './component/comapny/comapny.component';
import { UsersComponent } from './component/users/users.component';
import { GroupsComponent } from './component/groups/groups.component';
import { GroupchatComponent } from './component/groupchat/groupchat.component';
import { AllchatsComponent } from './component/allchats/allchats.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', redirectTo: 'newuser/:id', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthenticateGuard],
  },
  {
    path: 'register',
    component: NewuserComponent,
  },
  {
    path: 'forgotpassword/:id',
    component: ForgotpasswordComponent,
  },
  {
    path: 'chathistory',
    component: ChathistoryComponent,
    canActivate: [AuthenticateGuard]
  },
  {
    path: 'chathistory/:id',
    component: ChathistoryComponent,
    canActivate: [AuthenticateGuard]
  },
  {
    path: 'allchathistory',
    component: AllchatsComponent,
    canActivate: [AuthenticateGuard]
  },
  {
    path: 'allchathistory/:id',
    component: AllchatsComponent,
    canActivate: [AuthenticateGuard]
  },
  {
    path: 'company',
    component: ComapnyComponent,
    canActivate: [AuthenticateGuard]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthenticateGuard]
  },
  {
    path: 'groups',
    component: GroupsComponent,
    canActivate: [AuthenticateGuard]
  },
  {
    path: 'groupchat/:id',
    component: GroupchatComponent,
    canActivate: [AuthenticateGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
