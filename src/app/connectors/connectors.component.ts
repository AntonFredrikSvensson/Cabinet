import { Component, OnInit } from '@angular/core';
import {dropboxConfig} from '../environmentalVariables';

@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.css']
})
export class ConnectorsComponent implements OnInit {

  constructor() { } 

  ngOnInit(): void {
  }

  handleDbxAuthorization() {
    const urlAuth = `https://www.dropbox.com/oauth2/authorize?`
        + `client_id=${dropboxConfig.clientId}`
        + `&redirect_uri=${dropboxConfig.redirectUri}`
        + `&response_type=${dropboxConfig.responseType}`;
    window.location.href = urlAuth;
}

}
