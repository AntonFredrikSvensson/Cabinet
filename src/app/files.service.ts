import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Dropbox } from 'dropbox';
import { Router, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
  private subscription: Subscription;
  public stream:Subject<File>;
  dbx;

  constructor(
    private authService: DbxAuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.subscription = this.authService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));
    this.stream = new Subject<File>();
    this.dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
  }
  getFiles(path) {
    path = path.substring(6);
    // console.log(path);
    this.dbx.filesListFolder({ path: decodeURI(path) })
      .then(response => {
        const entries = response.entries;
        this.entriesToFiles(entries);
      });
  }
  entriesToFiles(entries) {
    entries.forEach(element => {
      const dbxFile:File = {
        type:element['.tag'],
        name:element.name,
        path:element.path_display,
        size:element.size,
        last_modified:element.server_modified,
        id:element.id,
        storageProvider:'Dropbox',
      }
      this.stream.next(dbxFile); 
    });
  }
}
