import { Component, OnInit } from '@angular/core';
import { dropboxConfig } from '../environmentalVariables';
import { DbxAuthService } from '../dbx-auth.service';
import { Subscription } from 'rxjs';
import { AuthObj } from '../auth';
//import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.css']
})
export class ConnectorsComponent implements OnInit {
  private dbxAuthSubscription: Subscription;
  public dbxAuth: AuthObj;

  constructor(private authService: DbxAuthService, 
    //private http: HttpClient, 
    ) { }

  ngOnInit(): void {
    this.dbxAuthSubscription = this.authService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));
  }

  handleDbxAuthorization() {
    const urlAuth = `https://www.dropbox.com/oauth2/authorize?`
      + `client_id=${dropboxConfig.clientId}`
      + `&redirect_uri=${dropboxConfig.redirectUri}`
      + `&response_type=${dropboxConfig.responseType}`;
    //this.http.get(urlAuth);
    window.location.href = urlAuth;
  }

  disconnectDBX() {
    this.authService.clearAuth();
  }

}
