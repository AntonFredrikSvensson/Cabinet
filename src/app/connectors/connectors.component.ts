import { Component, OnInit, OnDestroy  } from '@angular/core';
import { dropboxConfig } from '../environmentalVariables';
import { DbxAuthService } from '../dbx-auth.service';
import { Subscription } from 'rxjs';
import { AuthObj } from '../auth';

@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.css']
})
export class ConnectorsComponent implements OnInit, OnDestroy  {
  private dbxAuthSubscription: Subscription;
  public dbxAuth: AuthObj;

  constructor(private authService: DbxAuthService,  
    ) { }

  ngOnInit(): void {
    this.dbxAuthSubscription = this.authService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));
  }

  ngOnDestroy(): void{
    this.dbxAuthSubscription.unsubscribe();
  }

  handleDbxAuthorization() {
    this.authService.connectToDBX();
  }

  disconnectDBX() {
    this.authService.clearAuth();
  }

}
