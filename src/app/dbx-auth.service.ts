import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthObj } from './auth';
import { LocalStorageMethods } from './utils';
import { HttpClient } from '@angular/common/http';
import { dropboxConfig } from './environmentalVariables';

@Injectable({
  providedIn: 'root'
})
export class DbxAuthService {
  private dbxAuth: AuthObj = { isAuth: false }; // Set initial value isAuth: false
  private objBehaviorSubject: BehaviorSubject<any>;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    this.objBehaviorSubject = new BehaviorSubject(this.dbxAuth);

    // Get back saved credentials
    const savedCredentials: AuthObj = LocalStorageMethods.retrieve('dbxCredentials');
    if (savedCredentials) {
      this.storeAuth(savedCredentials);
    }
  }


  connectToDBX() {
    const urlAuth = `https://www.dropbox.com/oauth2/authorize?`
      + `client_id=${dropboxConfig.clientId}`
      + `&redirect_uri=${dropboxConfig.redirectUri}`
      + `&response_type=${dropboxConfig.responseType}`;
    window.location.href = urlAuth;
  }

  getAuth(): BehaviorSubject<AuthObj> {
    return this.objBehaviorSubject;
  }

  storeAuth(inDbxAuth: AuthObj) {
    this.dbxAuth = inDbxAuth;
    LocalStorageMethods.store('dbxCredentials', this.dbxAuth);
    // console.log('storeAuth isAuth: ' +  this.dbxAuth.isAuth);
    return this.objBehaviorSubject.next(this.dbxAuth);
  }

  clearAuth() {
    this.dbxAuth = {};
    LocalStorageMethods.clear();
    return this.objBehaviorSubject.next(this.dbxAuth);
  }
}
