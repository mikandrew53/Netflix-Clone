import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  isLoginMode = true;
  
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid)
      return;

    if(this.isLoginMode) {
      return;
    }else {
      const email = form.value.email;
      const password = form.value.password;
      this.authService.signup(email, password).subscribe(
        resData => console.log(resData),
        error => console.log(error)
      );
    }
      

    form.reset();
  }

}
