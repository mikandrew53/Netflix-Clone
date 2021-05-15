import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
 
import { AppComponent } from './app.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BrowseComponent } from './browse/browse.component';
import { AppRoutingModule } from './app.routing.module';
import { AuthGuard } from './authentication/sign-in/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';




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
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    FontAwesomeModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatProgressSpinnerModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
