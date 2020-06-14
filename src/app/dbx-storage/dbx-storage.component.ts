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
  public storageSpace;
  public usedSpace;
  public spacePercentage;
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
      //console.log('Current URL', this.currentUrl);
    });

    this.fileStreamSubscription = this.filesService.stream
      .subscribe((file) => {
        this.addFileToArray(file);

      });
  }

  addFileToArray(file){
    this.filesArray.push(file);
  }

  updateFileStream(inData: Array<any>) {
    this.compEntries = inData;
    this.getData();
    //this.renderData(this.compEntries);
    //console.log('compEntries: ', this.compEntries);
  }

  getData() {
    this.dbxConnection
      .usersGetSpaceUsage(null)
      .then(spaceInfo => {
        //console.log(spaceInfo);
        this.storageSpace = (spaceInfo.allocation.allocated / 1024 / 1024 / 1024).toFixed(2);
        this.usedSpace = (spaceInfo.used / 1024 / 1024 / 1024).toFixed(2);
        this.spacePercentage = (this.usedSpace / this.storageSpace) * 100;
        //console.log(this.spacePercentage);
      })
      .catch(error => {
        console.log(error);
      });
  }



}
