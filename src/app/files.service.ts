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
    // console.log('--- get Files ---');
    // console.log(path);
    let updatedPath;
    let storageIndicator;
    let pathList;
    if (path === '' || path === '/files') {
      updatedPath = '';
      storageIndicator = 'ALL';
    } else {
      pathList = path.split(':');
      if (pathList[0].slice(-3) === 'dbx') {
        storageIndicator = 'DBX';
        updatedPath = pathList[1];
      } else if (pathList[0].slice(-3) === 'gdr') {
        storageIndicator = 'GDR';
        updatedPath = pathList[1];
      }
    }
    // console.log(updatedPath);
    if (storageIndicator === 'ALL' || storageIndicator === 'DBX') {
      if (this.dbxAuth.isAuth) {
        // console.log('---get dbx files ---');
        this.getDbxFiles(updatedPath);
      }
    }
    if (storageIndicator === 'ALL' || storageIndicator === 'GDR') {
      if (this.gdrAuth.isAuth) {
        let tempFolderId = updatedPath;
        // console.log('---get gdr files---');
        if (updatedPath === '') {
          tempFolderId = 'root';
        }
        // console.log(tempFolderId);
        this.getGdrFiles(tempFolderId);
      }
    }
  }

  getGdrFiles(folderId) {
    // console.log('---get Gdr files---');
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.gdrAuth.accessToken
    });
    // https://www.googleapis.com/drive/v2/files/folderId/children
    // https://developers.google.com/drive/api/v2/reference/children/list
    // 'https://www.googleapis.com/drive/v2/files/' + folderId + '/children?'
    // `mimeType = 'application/vnd.google-apps.folder'`
    // `'root' in parents`
    const searchParameter = `'` + folderId + `' in parents`;

    const reqParams = new HttpParams().set('q', searchParameter);
    return this.http.get<any>('https://www.googleapis.com/drive/v2/files/',
      {
        headers: reqHeader,
        params: reqParams
      }
    )
      .subscribe(filesObject => this.gdrFilesListObjectToItemList(filesObject));
  }

  gdrFilesListObjectToItemList(filesObject) {
    // console.log('---tempFunction---');
    // console.log(filesObject);
    let i;
    for (i = 0; i < 10; i++) {
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
            // console.log(newFilesObject);
            nextPageToken = newFilesObject.nextPageToken;
          });
      }
      else {
        break;
      }
    }
    this.gdrEntriesToFiles(filesObject.items);
    return filesObject;
  }

  gdrEntriesToFiles(entries) {
    // console.log('---gdrEntriesToFiles---');
    // entries.forEach(FileElement => {
    //   console.log(FileElement);
    //   this.getSingleGdrFile(FileElement.id);
    // });
    entries.forEach(element => {
      const gdrFile: File = {
        type: '',
        name: element.title,
        last_modified: element.modifiedDate,
        id: element.id,
        storageProvider: 'Google Drive',
      };
      // setting folder and file specific attributes
      if (element.mimeType === 'application/vnd.google-apps.folder') {
        gdrFile.folderNavigationParameter = 'gdr:' + element.id;
        gdrFile.type = 'folder';
      } else {
        gdrFile.size = element.fileSize;
        gdrFile.type = 'file';
      }
      // console.log(gdrFile);
      this.fileStream.next(gdrFile);

    });
  }

  // getSingleGdrFile(fileId) {
  //   // console.log('---get Gdr single file---');
  //   const reqHeader = new HttpHeaders({
  //     Authorization: 'Bearer ' + this.gdrAuth.accessToken
  //   });
  //   return this.http.get<any>('https://www.googleapis.com/drive/v2/files/' + fileId + '?' + this.gdrAuth.accessToken,
  //     {
  //       headers: reqHeader
  //     }
  //   )
  //     .subscribe(element => {
  //       // console.log(element);
  //       // console.log(element.parents[0].id);
  //       let fType;
  //       if (element.mimeType == 'application/vnd.google-apps.folder') {
  //         fType = 'folder';
  //       } else {
  //         fType = 'file';
  //       }
  //       // console.log(element.mimeType + ' : ' + fType);
  //       const gdrFile: File = {
  //         type: fType,
  //         name: element.title,
  //         path: element.parents[0].id,
  //         size: element.fileSize,
  //         last_modified: element.modifiedDate,
  //         id: element.id,
  //         storageProvider: 'Google Drive',
  //       };
  //       // console.log(gdrFile);
  //       this.fileStream.next(gdrFile);
  //     });
  // }

  getDbxFiles(path) {
    // console.log(path);
    // path = path.substring(6);
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
        last_modified: element.server_modified,
        id: element.id,
        storageProvider: 'Dropbox',
      };
      // adding folder and file specific attributes
      if (dbxFile.type === 'folder') {
        dbxFile.folderNavigationParameter = 'dbx:' + element.path_display;
      } else {
        dbxFile.size = element.size;
      }


      this.fileStream.next(dbxFile);
    });
  }
}
