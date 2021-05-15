import { Injectable } from "@angular/core";

import { CanActivate, Router } from '@angular/router';
import { AuthService } from "../auth.service";

@Injectable({providedIn: 'root'})
export class SignUpGuard implements CanActivate {
    email:string = ''

    constructor(private router:Router, private auth: AuthService){}

    canActivate(){
        this.auth.signUpEmail.subscribe(email => {
            this.email = email;
            if(!this.validateEmail(this.email))
                this.router.navigate(['']);
        });
        if(!this.validateEmail(this.email))
            this.router.navigate(['']);
        return true;
    }

    validateEmail(email:string) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}