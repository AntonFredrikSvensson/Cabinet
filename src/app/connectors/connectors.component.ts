import { Component, OnInit } from '@angular/core';
import { dropboxConfig } from '../environmentalVariables';
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

  constructor(private authService: DbxAuthService,  
    ) { }

  ngOnInit(): void {
    this.dbxAuthSubscription = this.authService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));
  }

  handleDbxAuthorization() {
    this.authService.connectToDBX();
  }

  disconnectDBX() {
    this.authService.clearAuth();
  }

}
