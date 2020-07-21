import { GdriveAuthService } from './gdrive-auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  dbx;
  private gdrAuth: AuthObj;
  private gdrSubscription: Subscription;
  public fileStream: Subject<File>;

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
    this.fileStream = new Subject<File>();
    this.dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
  }

  getFiles(path) {
    if (this.dbxAuth.isAuth){
      this.getDbxFiles(path);
    }
    if (this.gdrAuth.isAuth){
      const tempFolderId = 'root'
      this.getGdrFiles(tempFolderId);
    }
  }

  getGdrFiles(folderId) {
    console.log('---get Gdr files---');
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.gdrAuth.accessToken
    });
    // https://www.googleapis.com/drive/v2/files/folderId/children 
    // https://developers.google.com/drive/api/v2/reference/children/list
    
    // https://www.googleapis.com/drive/v2/files
    // const reqParams = new HttpParams().set('q', `mimeType = 'application/vnd.google-apps.folder'`);
    return this.http.get<any>('https://www.googleapis.com/drive/v2/files/' + folderId + '/children?' + this.gdrAuth.accessToken,
      { headers: reqHeader, 
        // params: reqParams 
      }
    )
      .subscribe(filesObject => this.gdrFilesListObjectToItemList(filesObject));
  }

  gdrFilesListObjectToItemList(filesObject) {
    console.log('---tempFunction---');
    console.log(filesObject);
    let i;
    for (i = 0; i < 10; i++){
      let nextPageToken = filesObject.nextPageToken;
      if (nextPageToken) {
        const newreqHeader = new HttpHeaders({
          Authorization: 'Bearer ' + this.gdrAuth.accessToken
        });
        // const httpParams: HttpParamsOptions = { fromObject: myObject } as HttpParamsOptions;
        const reqParams = new HttpParams().set('pageToken', filesObject.nextPageToken);
        // console.log(filesObject.nextPageToken);
        this.http.get<any>('https://www.googleapis.com/drive/v2/files?' + this.gdrAuth.accessToken,
          { headers: newreqHeader, params: reqParams }
        )
        .subscribe(newFilesObject => {
          console.log(newFilesObject);
          nextPageToken = newFilesObject.nextPageToken;
        });
      }
      else{
        break;
      }
    }
    this.gdrEntriesToFiles(filesObject.items);
    return filesObject;
  }

  gdrEntriesToFiles(entries) {
    // console.log('---gdrEntriesToFiles---');
    entries.forEach(FileElement => {
      // console.log(FileElement);
      this.getSingleGdrFile(FileElement.id);
    });
    // => element {
    //   const gdrFile: File = {
    //     type: element.kind,
    //     name: element.title,
    //     path: element.selfLink,
    //     size: element.fileSize,
    //     last_modified: element.modifiedDate,
    //     id: element.id,
    //     storageProvider: 'Google Drive',
    //   };
    //   // console.log(gdrFile);
    //   this.fileStream.next(gdrFile);
    // });
  }

  getSingleGdrFile(fileId){
    console.log('---get Gdr single file---');
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.gdrAuth.accessToken
    });
    return this.http.get<any>('https://www.googleapis.com/drive/v2/files/' + fileId + '?' + this.gdrAuth.accessToken,
      { headers: reqHeader
      }
    )
      .subscribe(element => {
        console.log(element);
        const gdrFile: File = {
          type: element.mimeType,
          name: element.title,
          path: element.selfLink,
          size: element.fileSize,
          last_modified: element.modifiedDate,
          id: element.id,
          storageProvider: 'Google Drive',
        };
        console.log(gdrFile);
        this.fileStream.next(gdrFile);
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
      this.fileStream.next(dbxFile);
    });
  }
}
