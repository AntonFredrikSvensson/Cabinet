import { AuthObj } from './../auth';
import { Subscription } from 'rxjs';
import { FilesService } from './../files.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GdriveAuthService } from './../gdrive-auth.service';
import { Component, OnInit, SimpleChanges, OnDestroy, OnChanges } from '@angular/core';
import { UrlMethods } from '../utils';
import { File } from '../file';

@Component({
  selector: 'app-gdr-storage',
  templateUrl: './gdr-storage.component.html',
  styleUrls: ['./gdr-storage.component.css']
})
export class GdrStorageComponent implements OnInit, OnDestroy, OnChanges {
  private gdrAuthSubscription: Subscription;
  private gdrAuth: AuthObj;
  private currentUrl = '';
  private fileStreamSubscription: Subscription;
  public compEntries: Array<any> = [];
  public filesArray: Array<File>;

  constructor(
    private authService: GdriveAuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private filesService: FilesService,
  ) { }

  ngOnInit(): void {
    this.filesArray = [];

    this.gdrAuthSubscription = this.authService
      .getAuth()
      .subscribe(auth => (this.gdrAuth = auth));

    this.activatedRoute.url.subscribe(() => {
      this.currentUrl = UrlMethods.decodeWithoutParams(this.router.url);
      this.filesService.getGdrFiles();
    });

    this.fileStreamSubscription = this.filesService.gdrStream
      .subscribe((file) => {
        this.addFileToArray(file);
        // console.log('---fileStreamSubsciption---');
        // console.log(file);
      });

  }

  addFileToArray(file) {
    this.filesArray.push(file);
  }

  clearFilesArray(): void {
    this.filesArray = [];
  }

  ngOnDestroy(): void {
    this.fileStreamSubscription.unsubscribe();
    this.gdrAuthSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes: ' + changes);
  }
}
