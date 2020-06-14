import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  stream;
  dbx;

  constructor(
    private authService: DbxAuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.subscription = this.authService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    this.stream = new BehaviorSubject([]);
    this.dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
  }
  getFiles(path) {
    if (path === '/files') {
      path = '';
    }
    this.dbx.filesListFolder({ path: decodeURI(path) })
      .then(response => {
        const entries = response.entries;
        // this.stream.next(entries);
        this.entriesToFiles(entries);
      });


  }
  entriesToFiles(entries) {
    entries.forEach(element => {
      const dbxFile:File = {
        name:element.name,
        path:element.path_display,
        size:element.size,
        last_modified:element.server_modified,
        id:element.id,
      }
      this.stream.next(dbxFile);
      console.log(element);
      console.log(dbxFile);
    });
  }
}
