import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthObj } from './auth';
import { LocalStorageMethods } from './utils';

@Injectable({
  providedIn: 'root'
})
export class DbxAuthService {
  private dbxAuth: AuthObj = { isAuth: false }; // Set initial value isAuth: false
  private objBehaviorSubject: BehaviorSubject<any>;

  constructor(private router: Router) {
    this.objBehaviorSubject = new BehaviorSubject(this.dbxAuth);

    // Get back saved credentials
    const savedCredentials: AuthObj = LocalStorageMethods.retrieve('dbxCredentials');
    if (savedCredentials) {
      this.storeAuth(savedCredentials);
    }
  }

  getAuth(): BehaviorSubject<AuthObj> {
    return this.objBehaviorSubject;
  }

  storeAuth(inDbxAuth: AuthObj) {
    this.dbxAuth = inDbxAuth;
    LocalStorageMethods.store('dbxCredentials', this.dbxAuth);
    return this.objBehaviorSubject.next(this.dbxAuth);
  }
}
