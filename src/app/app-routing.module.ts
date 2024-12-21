import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent },

  {
    path: 'register',
    component: RegisterComponent,
    // canActivate: [publicGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [publicGuard],
  },
  // {
  //   path: 'forgot-password',
  //   component: ForgotPasswordComponent,
  // },

];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
