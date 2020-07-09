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
  private gdrAuth: AuthObj = { isAuth: false }; // Set initial value isAuth: false
  private authObjBehaviorSubject: BehaviorSubject<AuthObj>;


  constructor() {
    this.authObjBehaviorSubject = new BehaviorSubject(this.gdrAuth);

    // Get back saved credentials
    const savedCredentials: AuthObj = LocalStorageMethods.retrieve('gdrCredentials');
    if (savedCredentials) {
      this.storeAuth(savedCredentials);
    }
  }

  connectToGDrive() {
    const urlAuth = `https://accounts.google.com/o/oauth2/v2/auth?`
      + `scope=${gDriveConfig.scope}`
      + `&include_granted_scopes=${gDriveConfig.include_granted_scopes}`
      + `&response_type=${gDriveConfig.response_type}`
      + `&client_id=${gDriveConfig.clientId}`
      + `&redirect_uri=${gDriveConfig.redirect_uri}`;
    window.location.href = urlAuth;
  }

  getAuth(): BehaviorSubject<any> {
    return this.authObjBehaviorSubject;
  }

  storeAuth(inGdriveAuth: any) {
    this.gdrAuth = inGdriveAuth;
    LocalStorageMethods.store('gdrCredentials', this.gdrAuth);
    console.log('store Auth gdrAuthObj:');
    console.log(this.gdrAuth);
    return this.authObjBehaviorSubject.next(this.gdrAuth);
  }

  clearAuth() {
    this.gdrAuth = {};
    LocalStorageMethods.clear();
    return this.authObjBehaviorSubject.next(this.gdrAuth);
  }


}
