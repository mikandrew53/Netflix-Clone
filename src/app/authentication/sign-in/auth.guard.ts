import { Injectable } from "@angular/core";

import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth.service";

@Injectable({providedIn: 'root'})

export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot):
    | boolean
    | UrlTree 
    | Promise<boolean| UrlTree>
    | Observable<boolean | UrlTree>
    {
        if(!!this.authService.user.getValue())
            return true;
        return this.router.createUrlTree(['']);        
    }
}