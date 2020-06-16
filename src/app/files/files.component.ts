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

  constructor(
    private authService: DbxAuthService,
  ) { }

  ngOnInit(): void {
    this.dbxAuthSubscription = this.authService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));
  }

  ngOnDestroy(): void {
    this.dbxAuthSubscription.unsubscribe();
  }

}
