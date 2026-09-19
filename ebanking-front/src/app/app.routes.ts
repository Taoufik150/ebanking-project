import { Routes } from '@angular/router';

import CustomersListComponent from './pages/client-list/customers-list.component';
import { CustomerDetailComponent } from './pages/client-detail/customer-detail.component';
import { NewAccountComponent } from './pages/new-account/new-account.component';
import { AccountsListComponent } from './pages/accounts-list/accounts-list.component';
import { AccountDetailComponent } from './pages/account-detail/account-detail.component';

import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';

import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';

import { LoginComponent } from './pages/login/login.component';

import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { ClientHomeComponent } from './pages/client-home/client-home.component';
import {ClientAccountsComponent} from './pages/client-accounts/client-accounts.component';
import {ClientVirementsComponent} from './pages/client-Operations/client-virements.component';
import {CustomerProfileComponent} from './pages/client-profile/customer-profile.component';
import { SplashScreenComponent } from './pages/splash-screen/splash-screen.component';
import {SettingComponent} from './pages/setting/setting.component';
export const routes: Routes = [

// =========================
// LOGIN
// =========================
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'splash'
  },

  {
    path: 'splash',
    component: SplashScreenComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

// =========================
// ESPACE ADMIN
// =========================

  {
    path: 'admin-home',
    component: AdminHomeComponent,


children: [

  // /admin-home
  // → AdminDashboard automatiquement
  {
    path: '',
    pathMatch: 'full',
    component: AdminDashboardComponent
  },

  // /admin-home/profile
  {
    path: 'profile',
    component: AdminProfileComponent
  },

  // /admin-home/customers
  {
    path: 'customers',
    component: CustomersListComponent
  },

  // /admin-home/customers/:id
  {
    path: 'customers/:id',
    component: CustomerDetailComponent
  },

  // /admin-home/customers/:id/new-account
  {
    path: 'customers/:id/new-account',
    component: NewAccountComponent
  },

  // /admin-home/accounts
  {
    path: 'accounts',
    component: AccountsListComponent
  },

  // /admin-home/accounts/:id
  {
    path: 'accounts/:id',
    component: AccountDetailComponent
  },
  {
    path: 'settings',
    component:SettingComponent
  }
]


},

// =========================
// ESPACE CLIENT
// =========================

{
  path: 'client-home',
    component: ClientHomeComponent,


children: [

  // /client-home
  {
    path: '',
    pathMatch: 'full',
    component: ClientDashboardComponent
  },
  {
    path:'accounts',
    component:ClientAccountsComponent
  },{
    path: 'accounts/:id',
    component: AccountDetailComponent
  },
  {
    path:'transfers',
    component:ClientVirementsComponent
  },{
    path:'profile',
    component: CustomerProfileComponent
  },
  {
    path: 'settings',
    component:SettingComponent
  }

]


},



{
  path: '**',
    redirectTo: 'login'
}

];
