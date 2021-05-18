import { Component, OnInit } from '@angular/core';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  faGlobe = faGlobe;

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.auth.checkEmail('test@test.com').subscribe(
      resData =>  {
        console.log('test@test.com ' + resData.registered);
        console.log(resData);
        
      },
      error => {
        console.log(error);
      }
    );
      this.auth.checkEmail('test1@test.com').subscribe(
        resData =>  {
        console.log('success');
        console.log('test1@test.com ' + resData.registered);
        console.log(resData);
        
      },
      error => {
        console.log(error);
      }
    );
    
    // this.auth.signup('test@test1.com', '').subscribe(data => console.log(data));
    
  }

}
