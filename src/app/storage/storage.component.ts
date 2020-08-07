import { BreadCrumbsService } from './../bread-crumbs.service';
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
import { MethodCall } from '@angular/compiler';

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
  private fileArrayStreamSubscription: Subscription;
  public filesArray: Array<File>;

  constructor(
    private gdrAuthService: GdriveAuthService,
    private dbxAuthService: DbxAuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private filesService: FilesService,
    private breadCrumbService: BreadCrumbsService,
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

    // this.filesService.getFilesArray();

    this.fileArrayStreamSubscription = this.filesService.filesArrayStream
      .subscribe(
        (data: any) => {
          this.filesArray = data;
          // console.log(this.filesArray);
          // console.log('---fileArrayStreamSubscription---');
          this.sortFilesArray('type', 'desc');
        });
    }

  sortCompareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  sortFilesArray(key: string, order: string){
    // console.log('---sortArray---');
    this.filesArray.sort(this.sortCompareValues(key, order));
    // console.log(this.filesArray);
  }

  clearFilesArray(): void {
    this.filesService.clearFilesArray();
  }

  navigateToFolder(folderName, folderLink) {
    this.clearFilesArray();
    this.breadCrumbService.addBreadCrumb(folderName, folderLink);
  }
  downloadDbxFile(path: any){
    // console.log('---Storage component: download DBX file---');
    // console.log(path);
    this.filesService.downloadDbxFile(path);
  }

  ngOnDestroy(): void {
    this.gdrAuthSubscription.unsubscribe();
    this.dbxAuthSubscription.unsubscribe();
    this.fileArrayStreamSubscription.unsubscribe();
  }

}
