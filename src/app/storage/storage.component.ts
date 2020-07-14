import { UrlMethods } from './../utils';
import { ActivatedRoute, Router } from '@angular/router';
import { DbxAuthService } from './../dbx-auth.service';
import { FilesService } from './../files.service';
import { GdriveAuthService } from './../gdrive-auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';

import { AuthObj } from './../auth';
import { File } from '../file';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit, OnDestroy {
  private gdrAuthSubscription: Subscription;
  private gdrAuth: AuthObj;
  private dbxAuthSubscription: Subscription;
  private dbxAuth: AuthObj;
  private dbxConnection;
  private currentUrl = '';
  private fileStreamSubscription: Subscription;
  public filesArray: Array<File>;

  constructor(
    private gdrAuthService: GdriveAuthService,
    private dbxAuthService: DbxAuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private filesService: FilesService,
  ) { }

  ngOnInit(): void {
    this.gdrAuthSubscription = this.gdrAuthService
      .getAuth()
      .subscribe(auth => (this.gdrAuth = auth));

    this.dbxAuthSubscription = this.dbxAuthService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    this.dbxConnection = new Dropbox({ accessToken: this.dbxAuth.accessToken });

    this.activatedRoute.url.subscribe(() => {
      this.currentUrl = UrlMethods.decodeWithoutParams(this.router.url);
      this.filesService.getFiles(this.currentUrl);
      // console.log('Current URL', this.currentUrl);
    });

    this.filesArray = [];

    this.fileStreamSubscription = this.filesService.fileStream
      .subscribe((file) => {
        this.filesArray.push(file);
      });
  }

  clearFilesArray(): void {
    this.filesArray = [];
  }

  ngOnDestroy(): void {
    this.gdrAuthSubscription.unsubscribe();
    this.dbxAuthSubscription.unsubscribe();
    this.fileStreamSubscription.unsubscribe();
  }

}
