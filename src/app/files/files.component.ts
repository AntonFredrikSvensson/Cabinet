import { GdriveAuthService } from './../gdrive-auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DbxAuthService } from '../dbx-auth.service';
import { AuthObj } from '../auth';
import { Subscription } from 'rxjs';
import { FilesService } from '../files.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit, OnDestroy {

  public dbxAuth: AuthObj;
  private dbxAuthSubscription: Subscription;
  public gdrAuth: AuthObj;
  private gdrAuthSubscription: Subscription;

  constructor(
    private dbxAuthService: DbxAuthService,
    private gdrAuthService: GdriveAuthService,
  ) { }

  ngOnInit(): void {
    this.dbxAuthSubscription = this.dbxAuthService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    this.gdrAuthSubscription = this.gdrAuthService
      .getAuth()
      .subscribe(auth => (this.gdrAuth = auth));
  }

  ngOnDestroy(): void {
    this.dbxAuthSubscription.unsubscribe();
    this.gdrAuthSubscription.unsubscribe();
  }

}
