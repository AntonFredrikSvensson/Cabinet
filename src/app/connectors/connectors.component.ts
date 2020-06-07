import { Component, OnInit } from '@angular/core';
import { DbxAuthService } from '../dbx-auth.service';
import { Subscription } from 'rxjs';
import { AuthObj } from '../auth';

@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.css']
})
export class ConnectorsComponent implements OnInit {
  private dbxAuthSubscription: Subscription;
  public dbxAuth: AuthObj;

  constructor(private dbxAuthService: DbxAuthService,  
    ) { }

  ngOnInit(): void {
    this.dbxAuthSubscription = this.dbxAuthService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));
  }

  handleDbxAuthorization() {
    this.dbxAuthService.connectToDBX();
  }

  disconnectDBX() {
    this.dbxAuthService.clearAuth();
  }

  handleGdriveAuthorization() {
  }

  disconnectGdrive() {
  }

}
