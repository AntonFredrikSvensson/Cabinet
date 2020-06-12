import { Component, OnInit } from '@angular/core';
import { DbxAuthService } from '../dbx-auth.service';
import { AuthObj } from '../auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  public dbxAuth: AuthObj;
  private dbxAuthSubscription: Subscription;

  constructor(
    private authDbxService: DbxAuthService,
  ) { }

  ngOnInit(): void {
    this.dbxAuthSubscription = this.authDbxService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

  }

}
