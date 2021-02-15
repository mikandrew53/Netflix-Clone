import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './authentication/sign-in/auth.guard';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { BrowseComponent } from './browse/browse.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const appRoutes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'signin', component: SignInComponent },  
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