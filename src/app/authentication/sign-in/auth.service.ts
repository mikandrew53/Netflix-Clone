//   TMDB_key: '2005019c276c141dd69953e09116e1ee'
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap} from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  private authenticated:boolean = false;
  private TMBD_token: string;

  constructor(private http: HttpClient, private router: Router ) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAqNPn9SlOiwFUGi0466PeGMMUtpizmIZ4', 
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleSignUpError), 
    tap(resData => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken, 
        +resData.expiresIn
      );
    })); 
  }

  handleSignUpError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unkown error occurred';
      if(!errorRes.error || !errorRes.error.error){
        return throwError(errorMessage);
      }
      switch (errorRes.error.error.message){
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already';
          break;
        case 'OPERATION_NOT_ALLOWED':
          errorMessage = 'Password sign-in is disabled for this project';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          errorMessage = ' We have blocked all requests from this device due to unusual activity. Try again later.';
      }
      return throwError(errorMessage);
  }

  signIn(email: string, password: string) {

    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAqNPn9SlOiwFUGi0466PeGMMUtpizmIZ4',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleSigninError),
    tap(resData => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken, 
        +resData.expiresIn
      );
    })
    )
  }

  private handleSigninError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unkown error occurred';
      if(!errorRes.error || !errorRes.error.error){
        return throwError(errorMessage);
      }
      switch (errorRes.error.error.message){
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'The password is invalid or the user does not have a password';
          break;
        case 'USER_DISABLED':
          errorMessage = 'The user account has been disabled by an administrator';
      }
      return throwError(errorMessage);
  }



  private async handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const experationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user:User = new User(
      email,
      userId,
      token,
      experationDate,
      );
      this.user.next(user);
      this.authenticated = true;
      await this.getTMDB_token();
      user.setTMDB_token(this.TMBD_token);
      console.log(user);
      
      this.autoLogout(expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
  }


  get isAuthenticated(){
    return this.authenticated;
  }

  logout() {
    this.user.next(null); 
    this.router.navigate(['/signin']);
    localStorage.removeItem('userData');
    this.authenticated = false;
    if(this.tokenExpirationTimer)
      clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if(!userData)
      return;
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if(loadedUser.token){
      this.user.next(loadedUser);
      this.authenticated = true;
      const expiresIn = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.router.navigate(['/browse']);
      this.autoLogout(expiresIn);

    }
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  async getTMDB_token() {
    const TMBD_response = await fetch('https://api.themoviedb.org/3/authentication/token/new?api_key=2005019c276c141dd69953e09116e1ee')
    if(TMBD_response.ok) {
      const TMBD_responseData = await TMBD_response.json();
      this.TMBD_token = TMBD_responseData.request_token;
    }
  }

}
