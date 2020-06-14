import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthObj } from '../auth';
import { Subscription } from 'rxjs';
import { DbxAuthService } from '../dbx-auth.service';

@Component({
  selector: 'app-dbx-auth',
  templateUrl: './dbx-auth.component.html',
  styleUrls: ['./dbx-auth.component.css']
})
export class DbxAuthComponent implements OnInit {

  public dbxAuth: AuthObj;
  private subscription: Subscription;

  constructor(private authService: DbxAuthService,private router: Router) { }

  ngOnInit(): void {

    // Get credentials from service and keep data updated
    this.subscription = this.authService.getAuth()
    .subscribe((auth) => this.dbxAuth = auth);

    if (!this.dbxAuth.isAuth) {
      const authUrl = this.router.url;
      // console.log(authUrl);
      const parameters = authUrl.split('#')[1] || '';
      // console.log(parameters);
      if (parameters.length > 0) {
        const arrParams = parameters.split('&') || [];
        // console.log(arrParams);
        if (arrParams.length > 0) {
          const tempAuth: AuthObj = { isAuth: false };
          for (let i = 0; i < arrParams.length; i++) {
            const arrItem = arrParams[i].split('=');
            switch (arrItem[0]) {
              case 'access_token':
                // console.log(arrItem[1]);
                tempAuth.accessToken = arrItem[1];
                break;
              case 'token_type':
                // console.log(arrItem[1]);
                tempAuth.tokenType = arrItem[1];
                break;
              case 'uid':
                // console.log(arrItem[1]);
                tempAuth.uid = arrItem[1];
                break;
              case 'account_id':
                // console.log(arrItem[1]);
                tempAuth.accountId = arrItem[1];
                break;
              default:
                break;
            }
          }
          if (tempAuth.accessToken && tempAuth.tokenType && tempAuth.uid && tempAuth.accountId) {
            tempAuth.isAuth = true;
            this.dbxAuth = tempAuth;
          }


        }
        // Store credentials into Auth-service and into localStorage
        if (this.dbxAuth.isAuth) {
          this.authService.storeAuth(this.dbxAuth);
          this.router.navigate(['']); // Navigate the user to homepage



        }



      } else {
        this.router.navigate(['']);
      }

    }


  }
}
