import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit, OnDestroy{
  userSub: Subscription;
  isAuthenticated = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub =  this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe(); 
  }

  logout(){
    this.authService.logout();
  }

}
