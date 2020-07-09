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
  private gdriveIsAuthSubscription: Subscription;
  public gDriveIsAuth: AuthObj;
  private gdriveAuthSubscription: Subscription;
  public gdriveAuth: AuthObj;


  constructor(
    private authDbxService: DbxAuthService,
    private authGdriveService: GdriveAuthService,
  ) { }

  ngOnInit(): void {
    this.dbxAuthSubscription = this.authDbxService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    // this.gdriveIsAuthSubscription = this.authGdriveService
    //   .getIsAuth()
    //   .subscribe(auth => (this.gDriveIsAuth = auth));

    this.gdriveAuthSubscription = this.authGdriveService
      .getAuth()
      .subscribe(auth => (this.gdriveAuth = auth));
  }

  ngOnDestroy(): void {
    this.dbxAuthSubscription.unsubscribe();
    this.gdriveIsAuthSubscription.unsubscribe();
  }

  handleDbxAuthorization() {
    this.authDbxService.connectToDBX();
  }

  disconnectDBX() {
    this.authDbxService.clearAuth();
  }

  handleGdrAuthorization() {
    this.authGdriveService.connectToGDrive();
  }

  disconnectGDR() {
    this.authGdriveService.clearAuth();
  }

}
