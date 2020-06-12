import { Component, OnInit } from '@angular/core';
import { DbxAuthService } from '../dbx-auth.service';
import { Subscription } from 'rxjs';
import { AuthObj } from '../auth';
import { GdriveAuthService } from '../gdrive-auth.service';
import { promise } from 'protractor';
declare var gapi: any;

@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.css']
})
export class ConnectorsComponent implements OnInit {
  private dbxAuthSubscription: Subscription;
  public dbxAuth: AuthObj;
  //public gDriveIsAuth:boolean;
  public testparameter;

  public googleAuth: any;
  private gDriveSubscription: Subscription;

  constructor(
    private dbxAuthService: DbxAuthService,
    private gDriveAuthService: GdriveAuthService,
  ) { }

  ngOnInit(): void {
    //this.gDriveIsAuth = false;

    this.dbxAuthSubscription = this.dbxAuthService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    this.gDriveSubscription = this.gDriveAuthService
      .getAuth()
      .subscribe(
        (auth: any) => this.googleAuth = auth,
        (error: any) => console.log(error),
        //()=> (this.gDriveIsAuth = this.gDriveAuthService.isSignedIn()),
      );

  }

  // isSignedIn(){
  //   //this.gDriveIsAuth = 
  //   this.googleAuth.isSignedIn.get();
  // }

  handleDbxAuthorization() {
    this.dbxAuthService.connectToDBX();
  }

  disconnectDBX() {
    this.dbxAuthService.clearAuth();
  }

  handleGdriveAuthorization() {
    this.googleAuth = this.gDriveAuthService.connectToGDrive();
  }

  disconnectGdrive() {
    this.gDriveAuthService.clearAuth()
  }

} 
