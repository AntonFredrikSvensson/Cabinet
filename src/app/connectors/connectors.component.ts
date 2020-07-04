import { GdriveAuthService } from './../gdrive-auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { dropboxConfig } from '../environmentalVariables';
import { DbxAuthService } from '../dbx-auth.service';
import { Subscription } from 'rxjs';
import { AuthObj } from '../auth';

@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.css']
})
export class ConnectorsComponent implements OnInit, OnDestroy {
  private dbxAuthSubscription: Subscription;
  public dbxAuth: AuthObj;
  private gdriveAuthSubscription: Subscription;
  public gDriveAuth: AuthObj;
  private gdriveIsAuthSubscription: Subscription;
  public gDriveIsAuth: boolean;

  constructor(
    private authDbxService: DbxAuthService,
    private authGdriveService: GdriveAuthService,
  ) { }

  ngOnInit(): void {
    this.dbxAuthSubscription = this.authDbxService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    this.gdriveAuthSubscription = this.authGdriveService
      .getAuth()
      .subscribe(auth => (this.gDriveAuth = auth));

    this.gdriveIsAuthSubscription = this.authGdriveService
      .isAuth()
      .subscribe(auth => (this.gDriveIsAuth = auth));

  }

  ngOnDestroy(): void {
    this.dbxAuthSubscription.unsubscribe();
  }

  handleDbxAuthorization() {
    this.authDbxService.connectToDBX();
  }

  disconnectDBX() {
    this.authDbxService.clearAuth();
  }

  handleGdrAuthorization() {
    // this.authGdriveService.connectToGDrive();
    this.authGdriveService.isAuthChange();
    console.log(this.gDriveIsAuth);
  }

  disconnectGDR() {
    this.authGdriveService.clearAuth();
  }

}
