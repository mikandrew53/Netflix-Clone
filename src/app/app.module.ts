import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
 
import { AppComponent } from './app.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BrowseComponent } from './browse/browse.component';
import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'signin', component: SignInComponent },  
  { path: 'browse', component: BrowseComponent },  
]

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    LandingPageComponent,
    BrowseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
