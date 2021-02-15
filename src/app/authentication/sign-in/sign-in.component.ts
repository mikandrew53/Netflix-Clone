import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isAuthenticated = false;
  userSub: Subscription;

constructor(private authService:AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      console.log('wagwan');
      
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  async onSubmit(form: NgForm) {
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
        console.log(resData);
        console.log('hello');
        if(this.isAuthenticated){
          
          this.router.navigate(['browse']);
        }
      },
      error => console.log(error)
    );
    form.reset();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
