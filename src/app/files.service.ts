import { GdriveAuthService } from './gdrive-auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dropbox } from 'dropbox';
import { Router, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable, throwError, Subject, of } from 'rxjs';
import { catchError, retry, concatMap, map } from 'rxjs/operators';

import { LocalStorageMethods } from './utils';
import { AuthObj } from './auth';
import { File } from './file';
import { DbxAuthService } from './dbx-auth.service';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private dbxAuth: AuthObj;
  private dbxSubscription: Subscription;
  public dbxStream: Subject<File>;
  dbx;
  private gdrAuth: AuthObj;
  private gdrSubscription: Subscription;
  public gdrStream: Subject<File>;
  // private gdrpath = 'https://www.googleapis.com/drive/v2/files';

  constructor(
    private dbxAuthService: DbxAuthService,
    private gdrAuthService: GdriveAuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    // private tempFiel: any
  ) {
    this.dbxSubscription = this.dbxAuthService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));
    this.gdrSubscription = this.gdrAuthService
      .getAuth()
      .subscribe(auth => (this.gdrAuth = auth));
    this.dbxStream = new Subject<File>();
    this.gdrStream = new Subject<File>();
    this.dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
  }

  getGdrFiles(){
    // console.log('---get Gdr files---');
    // const reqHeader = new HttpHeaders({
    //   'Authorization': 'Bearer' + this.gdrAuth.accessToken
    // });
    return this.http.get<any>('https://www.googleapis.com/drive/v2/files?access_token=' + this.gdrAuth.accessToken,
      // {headers: reqHeader} 
    )
    .subscribe(filesList => this.tempFunction(filesList));
      // .pipe(
      //   filesList => this.tempFunction(filesList)
      //   // map(fl => {
      //   //   for (const [key, value] of Object.entries(fl.items)) {
      //   //     map(f => <File>{
      //   //       type: f['kind'],
      //   //       name: f['title'],
      //   //       path: f['selfLink'],
      //   //       size: f['fileSize'],
      //   //       last_modified: f['modifiedDate'],
      //   //       id: f['id'],
      //   //       storageProvider: 'Google Drive',
      //   //     });
      //   //   }
      //   // })
      // );
  }

  tempFunction(filesList){
    // console.log('---tempFunction---');
    // console.log(filesList);
    this.gdrEntriesToFiles(filesList.items);
    return filesList;
  }

  gdrEntriesToFiles(entries) {
    // console.log('---gdrEntriesToFiles---');
    entries.forEach(element => {
      const gdrFile: File = {
        type: element['kind'],
        name: element.title,
        path: element.selfLink,
        size: element.fileSize,
        last_modified: element.modifiedDate,
        id: element.id,
        storageProvider: 'Google Drive',
      };
      // console.log(gdrFile);
      this.gdrStream.next(gdrFile);
    });
  }


  getDbxFiles(path) {
    path = path.substring(6);
    this.dbx.filesListFolder({ path: decodeURI(path) })
      .then(response => {
        const entries = response.entries;
        this.dbxEntriesToFiles(entries);
      });
  }
  dbxEntriesToFiles(entries) {
    entries.forEach(element => {
      const dbxFile: File = {
        type: element['.tag'],
        name: element.name,
        path: element.path_display,
        size: element.size,
        last_modified: element.server_modified,
        id: element.id,
        storageProvider: 'Dropbox',
      };
      this.dbxStream.next(dbxFile);
    });
  }
}
