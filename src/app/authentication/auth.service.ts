//   TMDB_key: '2005019c276c141dd69953e09116e1ee'
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap} from 'rxjs/operators';
import { BehaviorSubject, throwError, Subject } from 'rxjs';
import { User } from './sign-in/user.model';
import { Router } from '@angular/router';
import firebase from "firebase";

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

export interface SignInError {
  msg: string,
  clearEmail: boolean,
  clearPassword: boolean
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  signUpEmail = new BehaviorSubject<string>(null);
  private currentSignInEmail = '';
  private tokenExpirationTimer: any;
  private authenticated:boolean = false;
  private TMBD_token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    ) { }

  setSignupEmail(email:string) {
    this.signUpEmail.next(email);
    this.currentSignInEmail = email;
  }  

  getCurrentSignInEmail(){
    return this.currentSignInEmail;
  }
  
  checkEmailapi(email){
    return this.http.post<{kind: string, registered: boolean, sessionId: string}>(
     'https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=AIzaSyAqNPn9SlOiwFUGi0466PeGMMUtpizmIZ4', 
   {
     identifier: email,
     continueUri: 'http://192.168.2.73:4200/'
   })
  }

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
    console.log(errorRes);
    
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


  facebookSigIn(){
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
  .then((result) => {
    let credential = result.credential as firebase.auth.OAuthCredential;
    let token = credential.accessToken;
    this.handleAuthentication(result.user.email, result.user.uid, token, 3600);
    this.router.navigate(['/browse']);
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });

  }

  private handleSigninError(errorRes: HttpErrorResponse){
    let error:SignInError = {
      msg: 'An unkown error occurred',
      clearEmail: false,
      clearPassword: false
    }
    
    
      if(!errorRes.error || !errorRes.error.error){
        return throwError(error);
      }
      switch (errorRes.error.error.message){
        case 'EMAIL_NOT_FOUND':
          error = {
            msg: 'There is no user record corresponding to this identifier. The user may have been deleted.',
            clearEmail: true,
            clearPassword: true
          };
          break;
        case 'INVALID_PASSWORD':
          error = {
            msg: 'The password is invalid or the user does not have a password',
            clearEmail: false,
            clearPassword: true
          };
          break;
        case 'USER_DISABLED':
          error = { 
            msg: 'The user account has been disabled by an administrator',
            clearEmail: false,
            clearPassword: false
          };
      }
      return throwError(error);
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
      this.autoLogout(expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
  }


  get isAuthenticated(){
    return this.authenticated;
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.user.next(null); 
      this.router.navigate(['/login']);
      localStorage.removeItem('userData');
      this.authenticated = false;
      if(this.tokenExpirationTimer)
        clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }).catch((error) => {
      console.log(error);
    });
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
