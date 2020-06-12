import { Injectable } from '@angular/core';
import { gDriveConfig } from './environmentalVariables';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageMethods } from './utils';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GdriveAuthService {
  private googleAuth: any = { isSignedIn: {le:false} };
  //private googleAuth;
  private googleUser;
  private userObjBehaviorSubject: BehaviorSubject<any>;
  private authObjBehaviorSubject: BehaviorSubject<any>;
  private isAuth:boolean;

  constructor() {
    this.userObjBehaviorSubject = new BehaviorSubject(this.googleUser);

    this.authObjBehaviorSubject = new BehaviorSubject(this.googleAuth);

    // Get back saved user credentials
    const userSavedCredentials: any = LocalStorageMethods.retrieve('userGdriveCredentials');
    if (userSavedCredentials) {
      this.storeUser(userSavedCredentials);
    }

    // Get back saved auth credentials
    const authSavedCredentials: any = LocalStorageMethods.retrieve('authGdriveCredentials');
    if (authSavedCredentials) {
      this.storeAuth(authSavedCredentials);
    }
   }

  connectToGDrive():any{
    this.initClient()
    .then(()=>this.signIn())
    .then(()=>{
      this.storeUser(this.googleUser);
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
          console.log('---Google Auth---')
          console.log(this.googleAuth);
        });
      });
    });

  }

  signIn(){
    console.log('sign in');
    this.googleAuth.signIn({
          prompt: 'consent'
        }).then((res)=>{
          console.log('---Google User---');
          //console.log(res);
          this.googleUser = res;

          this.storeAuth(this.googleAuth)

          console.log(this.googleUser)
          console.log('--- Google Auth---');
          console.log(this.googleAuth);
        });     
  }



  getUser(): BehaviorSubject<any> {
    return this.userObjBehaviorSubject;
  }

  storeUser(inGdriveUser: any) {
    this.googleUser = inGdriveUser;
    LocalStorageMethods.store('userGdriveCredentials', this.googleUser);

    return this.userObjBehaviorSubject.next(this.googleUser);
  }

  clearUser() {
    this.googleUser = {};
    LocalStorageMethods.clear();
    return this.userObjBehaviorSubject.next(this.googleUser);
  }

  getAuth(): BehaviorSubject<any> {
    return this.authObjBehaviorSubject;
  }

  storeAuth(inGdriveAuth: any) {
    this.googleAuth = inGdriveAuth;
    LocalStorageMethods.store('authGdriveCredentials', this.googleAuth);
    return this.authObjBehaviorSubject.next(this.googleAuth);
  }

  clearAuth() {
    this.googleAuth.signOut()
    .then(()=>{
      LocalStorageMethods.clear();
      return this.authObjBehaviorSubject.next(this.googleAuth);
    });
  }

  isSignedIn():boolean{
    return this.googleAuth.isSignedIn.get();
  }

  signOut(): void {
    this.googleAuth.signOut();
  }

}

