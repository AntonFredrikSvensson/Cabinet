import { Injectable } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { DbxAuthService } from './dbx-auth.service';
import { GdriveAuthService } from './gdrive-auth.service';
import { AuthObj } from './auth';
import { DbxFilesService } from './dbx-files.service';
import { GdrFilesService } from './gdr-files.service';
import { File } from './file';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private dbxAuth: AuthObj;
  private dbxSubscription: Subscription;
  private gdrAuth: AuthObj;
  private gdrSubscription: Subscription;

  private gdrFileStreamSubscription: Subscription;
  private dbxFileStreamSubscription: Subscription;

  private filesArray: Array<File>;
  public filesArrayStream: Subject<Array<File>>;

  constructor(
    private dbxAuthService: DbxAuthService,
    private gdrAuthService: GdriveAuthService,
    private gdrFilesService: GdrFilesService,
    private dbxFilesService: DbxFilesService,
  ) {
    this.dbxSubscription = this.dbxAuthService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    this.gdrSubscription = this.gdrAuthService
      .getAuth()
      .subscribe(auth => (this.gdrAuth = auth));

    this.filesArray = [];

    this.filesArrayStream = new Subject<Array<File>>();

    this.gdrFileStreamSubscription = this.gdrFilesService.gdrFileStream
      .subscribe((file) => {
        this.filesArray.push(file);
        this.filesArrayStream.next(this.filesArray);
      },
      );

    this.dbxFileStreamSubscription = this.dbxFilesService.dbxFileStream
      .subscribe((file) => {
        this.filesArray.push(file);
        this.filesArrayStream.next(this.filesArray);
      });
  }

  // getFilesArray() {
  //   this.filesArrayStream.next(this.filesArray);
  // }

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
        this.dbxFilesService.getDbxFiles(updatedPath);
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
        this.gdrFilesService.getGdrFiles(tempFolderId);
      }
    }
  }

  clearFilesArray() {
    this.filesArray = [];
    this.filesArrayStream.next(this.filesArray);
  }

  downloadDbxFile(path: string, fileName: string){
    this.dbxFilesService.downloadFile(path, fileName);
  }
}
