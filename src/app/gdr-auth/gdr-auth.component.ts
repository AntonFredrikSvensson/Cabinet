import { Subscription } from 'rxjs';
import { AuthObj } from './../auth';
import { GdriveAuthService } from './../gdrive-auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gdr-auth',
  templateUrl: './gdr-auth.component.html',
  styleUrls: ['./gdr-auth.component.css']
})
export class GdrAuthComponent implements OnInit, OnDestroy {

  public gdrAuth: AuthObj;
  private subscription: Subscription;

  constructor(private authService: GdriveAuthService, private router: Router) { }

  ngOnInit(): void {

    // Get credentials from service and keep data updated
    this.subscription = this.authService.getAuth()
      .subscribe((auth) => this.gdrAuth = auth);

    if (!this.gdrAuth.isAuth) {
      const authUrl = this.router.url;
      // console.log(authUrl);
      const parameters = authUrl.split('#')[1] || '';
      // console.log(parameters);
      if (parameters.length > 0) {
        const arrParams = parameters.split('&') || [];
        // console.log(arrParams);
        if (arrParams.length > 0) {
          const tempAuth: AuthObj = { isAuth: false };
          // tslint:disable-next-line: prefer-for-of
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
              case 'expires_in':
                // console.log(arrItem[1]);
                tempAuth.expires_in = arrItem[1];
                break;
              case 'scope':
                // console.log(arrItem[1]);
                tempAuth.scope = arrItem[1];
                break;
              case 'authuser':
                // console.log(arrItem[1]);
                tempAuth.authuser = arrItem[1];
                break;
              case 'prompt':
                // console.log(arrItem[1]);
                tempAuth.prompt = arrItem[1];
                break;
              default:
                break;
            }
          }
          if (tempAuth.accessToken && tempAuth.tokenType) {
            // console.log('tempAuth.isAuth set to true');
            tempAuth.isAuth = true;
            this.gdrAuth = tempAuth;
          }else{
            // console.log('tempAuth.isAuth set to false');
            // console.log(tempAuth);
          }


        }
        // console.log('gdrAuth.isAuth: ' + this.gdrAuth.isAuth);
        // Store credentials into Auth-service and into localStorage
        if (this.gdrAuth.isAuth) {
          // console.log(this.gdrAuth);
          this.authService.storeAuth(this.gdrAuth);
          this.router.navigate(['']); // Navigate the user to homepage



        }



      } else {
        this.router.navigate(['']);
      }

    }


  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
