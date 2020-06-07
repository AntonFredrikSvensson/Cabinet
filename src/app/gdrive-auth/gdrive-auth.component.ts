import { Component, OnInit } from '@angular/core';
import { gDriveConfig } from '../environmentalVariables';
declare var gapi: any;

@Component({
  selector: 'app-gdrive-auth',
  templateUrl: './gdrive-auth.component.html',
  styleUrls: ['./gdrive-auth.component.css']
})
export class GdriveAuthComponent implements OnInit {
  private googleAuth;

  private isAuthorized;
  private currentApiRequest;

  private user_test;

  constructor() { }

  ngOnInit(): void {
  }

  handleGdriveAuthorization() {
    //console.log('starting auth');
    this.initClient();
  }
  //cb=gapi.loaded_0:235 GET https://content.googleapis.com/discovery/v1/apis/h/v1/rest?fields=kind%2Cname%2Cversion%2CrootUrl%2CservicePath%2Cresources%2Cparameters%2Cmethods%2CbatchPath%2Cid&pp=0&key=AIzaSyC-bvuLxCw_wJxcM4k_yJKCySnLuPvFliI 404

  initClient() {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', () => {
        return gapi.client.init({
          apiKey: gDriveConfig.apiKey,
          clientId: gDriveConfig.clientId,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
        }).then(() => {
          this.googleAuth = gapi.auth2.getAuthInstance();
          resolve();
          console.log('---Google Auth---')
          console.log(this.googleAuth);
        });
      });
    });

  }


  signIn(){
    console.log('sign in');
    this.googleAuth.signIn({
          prompt: 'consent'
        }).then((res)=>{
          console.log('---Google User---');
          console.log(res);
        });
  }

  getFiles(folderId: string = 'root') {
    return gapi.client.drive.files.list({
        pageSize: 100,
        fields: "nextPageToken, files(id, name, mimeType, modifiedTime, size)",
        q: `'${folderId}' in parents and trashed = false`
    }).then((res) => {
      console.log('---Files---');
      console.log(res);
        // let files: FileInfo[] = [];
        // res.result.files.forEach((file) => files.push(FileInfo.fromGoogleFile(file)));
        // return files;
    });
}

  // signIn() {
  //   return this.googleAuth.signIn({
  //     prompt: 'consent'
  //   }).then((googleUser: gapi.auth2.GoogleUser) => {
  //     //this.appRepository.User.add(googleUser.getBasicProfile());
  //     this.user_test = googleUser.getBasicProfile()
  //     console.log(this.user_test);

  //   });
  // }


  // handleClientLoad() {
  //   gapi.load('client:auth2', this.initClient);
  // }



  // initClient() {
  //   gapi.client.init({
  //     'apiKey': gDriveConfig.apiKey,
  //     'client_id': gDriveConfig.clientId,
  //     'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
  //     'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
  //   }).then(() => {
  //     this.GoogleAuth = gapi.auth2.getAuthInstance();
  //     console.log(this.GoogleAuth);
  //     // Listen for sign-in state changes.
  //     this.GoogleAuth.isSignedIn.listen(this.updateSigninStatus);
  //   });
  // }

  /**
 * Store the request details. Then check to determine whether the user
 * has authorized the application.
 *   - If the user has granted access, make the API request.
 *   - If the user has not granted access, initiate the sign-in flow.
 */
  // sendAuthorizedApiRequest(requestDetails) {
  //   this.currentApiRequest = requestDetails;
  //   if (this.isAuthorized) {
  //     // Make API request
  //     // gapi.client.request(requestDetails)

  //     // Reset currentApiRequest variable.
  //     this.currentApiRequest = {};
  //   } else {
  //     this.GoogleAuth.signIn();
  //   }
  // }

  // /**
  //  * Listener called when user completes auth flow. If the currentApiRequest
  //  * variable is set, then the user was prompted to authorize the application
  //  * before the request executed. In that case, proceed with that API request.
  //  */
  // updateSigninStatus(isSignedIn) {
  //   if (isSignedIn) {
  //     this.isAuthorized = true;
  //     if (this.currentApiRequest) {
  //       this.sendAuthorizedApiRequest(this.currentApiRequest);
  //     }
  //   } else {
  //     this.isAuthorized = false;
  //   }
  // }

}
