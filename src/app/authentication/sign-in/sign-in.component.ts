import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService, AuthResponseData, SignInError } from '../auth.service';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import firebase from "firebase";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isAuthenticated = false;
  loading:boolean = false;
  userSub: Subscription;
  faGlobe = faGlobe
  @ViewChild('EmailInput', {static: true}) emailInput:ElementRef;
  @ViewChild('PasswordInput', {static: true}) passwordInput:ElementRef;

constructor(private authService:AuthService, private router: Router) { }
  error:SignInError;
  emailErrorMsg:string = 'Please enter a valid email.'
  passwordErrorMsg:string = 'Your password must contain at least 6 characters.'
  showGoogleMsg = false;
  controls =  {
    email: { valid: false, errorMsg: '', touched: false },
    password: { valid: false, errorMsg: '', touched: false }
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });    
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid){
      if(!this.controls.email.touched){
        this.controls.email.valid = false;
        this.controls.email.errorMsg = this.emailErrorMsg;
        this.controls.email.touched = true;
      }
      if(!this.controls.password.touched){
        this.controls.password.valid = false;
        this.controls.password.errorMsg = this.passwordErrorMsg;
        this.controls.password.touched = true;
      }
      return;
    }
      
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    if(this.isLoginMode) {
      authObs = this.authService.signIn(email, password);
    }else {
      authObs = this.authService.signup(email, password);
    }
    this.loading = true;
    authObs.subscribe(
      resData =>  {
        this.loading = false;
        if(this.isAuthenticated)
          this.router.navigate(['browse']);
      },
      error => {
        this.handleServerError(error, form)
        this.loading = false;
      }
    );
  }

  handleServerError(error:SignInError, form:NgForm){
    this.error = error;
    this.controls.email.touched = true;
    this.controls.password.touched = true;
    if(error.clearEmail){
      this.emailInput.nativeElement.value = '';
      this.controls.email.valid = false;
      this.controls.email.errorMsg = '';
      form.controls.email.reset();

    }
    if(error.clearPassword){
      this.passwordInput.nativeElement.value = '';
      this.controls.password.errorMsg = '';
      this.controls.password.valid = false;
      form.controls.password.reset();
    }

    // https://netflix-clone-9fb80.firebaseapp.com/__/auth/handler
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onEmailFocousOut(form: NgForm){
    this.controls.email.touched = true;
    if(form.controls.email.status === 'INVALID') {
      this.controls.email.valid = false;
      this.controls.email.errorMsg = this.emailErrorMsg;
    }else
      this.controls.email.valid = true;
  }
  
  onEmailKeyDown(form:NgForm){
    if(!this.controls.email.touched)
      return;

    if(form.controls.email.status === 'INVALID') {
      this.controls.email.valid = false;
      this.controls.email.errorMsg = this.emailErrorMsg;
    }else
      this.controls.email.valid = true;
  }

  onPasswordFocousOut(form:NgForm){
    this.controls.password.touched = true;
    if(form.controls.password.status === 'INVALID' ){
      this.controls.password.valid = false;
      this.controls.password.errorMsg = this.passwordErrorMsg;
    }else {
      this.controls.password.valid = true;
    }
  }
  
  onPasswordKeyDown(form:NgForm){
    if(!this.controls.password.touched)
      return;

    if(form.controls.password.status === 'INVALID' ){
      this.controls.password.valid = false;
      this.controls.password.errorMsg = this.passwordErrorMsg;
    }else {
      this.controls.password.valid = true;
    }
  }

  loginWithFacebook(){
    this.authService.facebookSigIn();
  }
}
