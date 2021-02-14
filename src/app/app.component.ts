import { Component, OnInit } from '@angular/core';
import { AuthService } from './authentication/sign-in/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'netflix-clone';
  constructor(private authService: AuthService){}
  ngOnInit() {
    this.authService.autoLogin();
  }
}
