import { AuthObj } from './auth';
import { Injectable } from '@angular/core';
import { gDriveConfig } from './environmentalVariables';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageMethods } from './utils';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GdriveAuthService {
  private gdrIsAuth: AuthObj = { isAuth: false }; // Set initial value isAuth: false
  private googleAuth: any;
  private googleUser: any;
  private authObjBehaviorSubject: BehaviorSubject<any>;
  private isAuthBehaviorSubject: BehaviorSubject<AuthObj>;

  constructor() {

    this.authObjBehaviorSubject = new BehaviorSubject(this.googleAuth);
    this.isAuthBehaviorSubject = new BehaviorSubject(this.gdrIsAuth);

    // Get back saved auth credentials
    const authSavedCredentials: any = LocalStorageMethods.retrieve('gdrIsAuth');
    if (authSavedCredentials) {
      this.storeIsAuth(authSavedCredentials);
    }else{
      // console.log('constructor: no auth credentials to load');
    }
  }

  connectToGDrive(): void {
    if (!this.gdrIsAuth.isAuth) {
      this.initClient()
        .then(() => this.signIn());
    } else {
      console.log('already connected to gdrive');

    }

  }

  initClient() {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', () => {
        return gapi.client.init({
          apiKey: gDriveConfig.apiKey,
          clientId: gDriveConfig.clientId,
          discoveryDocs: gDriveConfig.discoveryDocs,
          scope: gDriveConfig.scope,
        }).then(() => {
          this.googleAuth = gapi.auth2.getAuthInstance();
          resolve();
          console.log('---InitClient Google Auth---');
          console.log(this.googleAuth);
        });
      });
    });

  }

  signIn() {
    console.log('sign in');
    this.googleAuth.signIn({
      prompt: 'consent'
    }).then((res) => {
      // console.log('---Google User---');
      // console.log(res);
      this.googleUser = res;
      console.log(this.googleUser);
      console.log('--- sign in Google Auth---');
      console.log(this.googleAuth);
      // this.storeAuth(this.googleAuth);
      // console.log(this.googleAuth.isSignedIn());
    }).then(() => {
      this.gdrIsAuth.isAuth = this.googleAuth.isSignedIn.get();
      console.log('---gdrIsAuth.isAuth---');
      console.log(this.gdrIsAuth.isAuth);
      this.storeIsAuth(this.gdrIsAuth);
      this.storeAuth(this.googleAuth);
    });
  }

  getIsAuth(): BehaviorSubject<any> {
    return this.isAuthBehaviorSubject;
  }

  storeIsAuth(inGdriveAuth: any) {
    this.gdrIsAuth = inGdriveAuth;
    LocalStorageMethods.store('gdrIsAuth', this.gdrIsAuth);
    console.log('storeIsAuth isAuth: ' +  this.gdrIsAuth.isAuth);
    return this.isAuthBehaviorSubject.next(this.gdrIsAuth);
  }

  getAuth(): BehaviorSubject<any> {
    return this.authObjBehaviorSubject;
  }

  storeAuth(inGdriveAuth: any) {
    this.googleAuth = inGdriveAuth;
    LocalStorageMethods.store('googleAuthObj', this.googleAuth);
    console.log('store Auth googleAuth:');
    console.log(this.googleAuth);
    return this.authObjBehaviorSubject.next(this.googleAuth);
  }

  clearAuth() {
    console.log('clear auth');
    if (typeof(this.googleAuth) !== 'undefined'){
    this.googleAuth.signOut()
      .then(() => {
        LocalStorageMethods.clear();
        return this.isAuthBehaviorSubject.next(this.gdrIsAuth);
      });
    }else{
      LocalStorageMethods.clear();
    }
  }


}
