import { Injectable } from "@angular/core";

import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { from, Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { LandingPageComponent } from './../../landing-page/landing-page.component';

@Injectable({providedIn: 'root'})

export class AuthGuard implements CanActivate {

    constructor(private landingComponent:LandingPageComponent, private router:Router){}

    canActivate(){
        this.landingComponent.signUpEmail.subscribe(data => {
            if(data.email.length === 0)
                this.router.navigate(['']);
        });
        return true;
    }
}