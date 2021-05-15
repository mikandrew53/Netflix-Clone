import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './authentication/sign-in/auth.guard';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { BrowseComponent } from './browse/browse.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SignUpGuard } from './authentication/sign-up/signup.guard';

const appRoutes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: SignInComponent },  
    { path: 'signup',
     component: SignUpComponent,
     canActivate: [SignUpGuard]
    },  
    { 
      path: 'browse',
      component: BrowseComponent,
      canActivate: [AuthGuard]
    },  
  ];
  

@NgModule ({
    providers: [AuthGuard],
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})

export class AppRoutingModule {
    
}