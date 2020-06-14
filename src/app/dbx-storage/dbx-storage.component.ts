import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { DbxAuthService } from '../dbx-auth.service';
import { Subscription } from 'rxjs';
import { AuthObj } from '../auth';
import { Dropbox } from 'dropbox';
import { ActivatedRoute, Router } from '@angular/router';
import { FilesService } from '../files.service';
import { UrlMethods } from '../utils';
import { File } from '../file';

@Component({
  selector: 'app-dbx-storage',
  templateUrl: './dbx-storage.component.html',
  styleUrls: ['./dbx-storage.component.css']
})
export class DbxStorageComponent implements OnInit {
  private dbxAuthSubscription: Subscription;
  private dbxAuth: AuthObj;
  private dbxConnection;
  private currentUrl = '';
  private fileStreamSubscription: Subscription;
  public compEntries: Array<any> = [];
  public filesArray:Array<File> = [];

  constructor(private authService: DbxAuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private filesService: FilesService, ) { }

  ngOnInit(): void {
    this.dbxAuthSubscription = this.authService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    this.dbxConnection = new Dropbox({ accessToken: this.dbxAuth.accessToken });

    this.activatedRoute.url.subscribe(() => {
      this.currentUrl = UrlMethods.decodeWithoutParams(this.router.url);
      this.filesService.getFiles(this.currentUrl);
      // console.log('Current URL', this.currentUrl);
    });

    this.fileStreamSubscription = this.filesService.stream
      .subscribe((file) => {
        this.addFileToArray(file);
      });

  }

  addFileToArray(file){
    this.filesArray.push(file);
  }

}
