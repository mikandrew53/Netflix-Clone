import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService, AuthResponseData, SignInError } from './auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isAuthenticated = false;
  userSub: Subscription;
  @ViewChild('EmailInput', {static: true}) emailInput:ElementRef;
  @ViewChild('PasswordInput', {static: true}) passwordInput:ElementRef;

constructor(private authService:AuthService, private router: Router) { }
  error:SignInError;
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
    if(!form.valid)
      return;
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    if(this.isLoginMode) {
      authObs = this.authService.signIn(email, password);
    }else {
      authObs = this.authService.signup(email, password);
    }
      
    authObs.subscribe(
      resData =>  {
        if(this.isAuthenticated)
          this.router.navigate(['browse']);
      },
      error => this.handleServerError(error, form)
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


  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onEmailFocousOut(form: NgForm){
    this.controls.email.touched = true;
    if(form.controls.email.status === 'INVALID') {
      this.controls.email.valid = false;
      this.controls.email.errorMsg = 'Please enter a valid email.';
    }else
      this.controls.email.valid = true;
  }
  
  onEmailKeyDown(form:NgForm){
    if(!this.controls.email.touched)
      return;

    if(form.controls.email.status === 'INVALID') {
      this.controls.email.valid = false;
      this.controls.email.errorMsg = 'Please enter a valid email.';
    }else
      this.controls.email.valid = true;
  }

  onPasswordFocousOut(form:NgForm){
    this.controls.password.touched = true;
    console.log(form);
    if(form.controls.password.status === 'INVALID' ){
      this.controls.password.valid = false;
      this.controls.password.errorMsg = 'Your password must contain at least 6 characters.'
    }else {
      this.controls.password.valid = true;
    }
  }
  
  onPasswordKeyDown(form:NgForm){
    if(!this.controls.password.touched)
      return;

    if(form.controls.password.status === 'INVALID' ){
      this.controls.password.valid = false;
      this.controls.password.errorMsg = 'Your password must contain at least 6 characters.'
    }else {
      this.controls.password.valid = true;
    }
  }

}
