import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { faGlobe, faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from '../auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  init = false;
  faGlobe = faGlobe;
  faCheck = faCheck;
  faExclamationTriangle = faExclamationTriangle;
  isAuthenticated = false;
  loading:boolean = false;
  userSub: Subscription;
  // stepOne:boolean = true;
  // stepOneOpened:boolean = true;
  stepOne:boolean = false;
  stepOneOpened:boolean = false;
  stepOneB:boolean = false;
  stepOneBOpened:boolean = false;
  stepTwo: boolean = false;
  stepTwoB: boolean = false;
  stepTwoOpened: boolean = false;
  stepTwoBOpened: boolean = false;
  stepThree: boolean = false;
  stepThreeOpened: boolean = false;
  error;
  emailExists:boolean = false;
  controls =  {
    email: { valid: false, errorMsg: '', touched: false },
    password: { valid: false, errorMsg: '', touched: false }
  }

  emailErrorMsg:string = 'Please enter a valid email address.'
  passwordErrorMsg:string = 'Your password must contain at least 6 characters.'

  @ViewChild('EmailInput', {static: true}) emailInput:ElementRef;
  @ViewChild('PasswordInput', {static: true}) passwordInput:ElementRef;
  @ViewChild('authForm', {static: true}) authForm: NgForm;

  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
    // #b92d2b
  }

  ngAfterContentChecked(): void {
    
    if(this.validateEmail(this.authService.getCurrentSignInEmail()) && this.authForm.controls.email && !this.init){
      this.init = true;
      this.authForm.controls.email.setValue(this.authService.getCurrentSignInEmail());
      this.controls.email.valid = true;
    }
  }
  
  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    
  }
  
  goToStepOneB() {
    this.stepOne = false;
    this.stepOneB = true;
    this.stepOneBOpened = true;
  }
  goToStepTwoB(){
    this.stepTwo = false;
    this.stepTwoB = true;
    this.stepTwoBOpened = true;
  }

  validateEmail(email:string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  OnSignIn(){
    this.authService.setSignupEmail('');
    this.router.navigate(['login']);
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
    // console.log(this.emailInput.nativeElement.value);
    // console.log(this.emailInput.nativeElement.value === '');
    
    if(!this.controls.email.touched)
      return;
    if(form.controls.email.status === 'INVALID') {
      this.controls.email.valid = false;
      if (this.emailInput.nativeElement.value === '')
        this.controls.email.errorMsg = 'Email is required!';
      else
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

      authObs = this.authService.signup(email, password);
      this.loading = true;
      authObs.subscribe(
        resData =>  {
          console.log(resData);
          this.loading = false;
          // if(this.isAuthenticated){
            console.log('authenticated');
            this.stepOneB = false;
            this.stepTwo = true;
            // this.router.navigate(['browse']);
          // }
        },
        error => {
          console.log('error');
          
          this.handleServerError(error, form)
          console.log(error);
          
          this.loading = false;
        }
      );
  }

  goToSignIn() {
    this.authService.setSignupEmail(this.emailInput.nativeElement.value);
    this.router.navigate(['login'])
  }
  handleServerError(error, form:NgForm){
    this.error = error;
    if(this.error === 'This email exists already')
      this.emailExists = true;

      
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
    // this.userSub.unsubscribe();
  }


}
