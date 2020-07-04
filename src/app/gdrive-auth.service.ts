import { AuthObj } from './auth';
import { Injectable } from '@angular/core';
import { gDriveConfig } from './environmentalVariables';
import { Subject, BehaviorSubject } from 'rxjs';
import { LocalStorageMethods } from './utils';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GdriveAuthService {
  private gdrAuth: AuthObj = { isAuth: false }; // Set initial value isAuth: false
  private googleAuth: any;
  private googleUser: any;
  private authObjBehaviorSubject: BehaviorSubject<any>;
  private gDriveIsAuth = false;
  private isAuthBehaviorSubject: BehaviorSubject<boolean>;

  constructor() {

    // this.authObjBehaviorSubject = new BehaviorSubject(this.googleAuth);
    this.authObjBehaviorSubject = new BehaviorSubject(this.gdrAuth);
    this.isAuthBehaviorSubject = new BehaviorSubject(this.gDriveIsAuth);

    // Get back saved auth credentials
    const authSavedCredentials: any = LocalStorageMethods.retrieve('authGdriveCredentials');
    if (authSavedCredentials) {
      this.storeAuth(authSavedCredentials);
    }
  }

  connectToGDrive(): any {
    this.initClient()
      .then(() => this.signIn())
      .then(() => {
        // this.storeUser(this.googleUser);
        this.storeAuth(this.googleAuth);
        console.log('--- Store Auth, google user ---');
        console.log(this.googleUser);
        return this.googleAuth;
      });
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
          console.log('---Google Auth---');
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

      this.storeAuth(this.googleAuth);

      console.log(this.googleUser);
      console.log('--- Google Auth---');
      console.log(this.googleAuth);
      // console.log(this.googleAuth.isSignedIn());
    }).then(() => {
      this.gdrAuth.isAuth = this.googleAuth.isSignedIn.get();
      console.log('---gdr auth isAuth---');
      console.log(this.gdrAuth.isAuth);
      this.storeAuth(this.gdrAuth);
    });
  }

  getAuth(): BehaviorSubject<any> {
    return this.authObjBehaviorSubject;
  }

  isAuth(): BehaviorSubject<boolean> {
    return this.isAuthBehaviorSubject;
  }

  isAuthChange(): void{
    if (!this.gDriveIsAuth){
      console.log('isAuthChange false->true');
      this.gDriveIsAuth = true;
      console.log(this.gDriveIsAuth);
    }else{
      console.log('isAuthChange ture->false');
      this.gDriveIsAuth = false;
    }
    return this.isAuthBehaviorSubject.next(this.gDriveIsAuth);
  }

  storeAuth(inGdriveAuth: any) {
    this.gdrAuth = inGdriveAuth;
    LocalStorageMethods.store('authGdriveCredentials', this.gdrAuth);
    return this.authObjBehaviorSubject.next(this.gdrAuth);
    // this.googleAuth = inGdriveAuth;
    // LocalStorageMethods.store('authGdriveCredentials', this.googleAuth);
    // return this.authObjBehaviorSubject.next(this.googleAuth);
  }

  clearAuth() {
    this.googleAuth.signOut()
      .then(() => {
        LocalStorageMethods.clear();
        return this.authObjBehaviorSubject.next(this.googleAuth);
      });
  }


}
