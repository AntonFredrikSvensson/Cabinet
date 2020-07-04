import { GdriveAuthService } from './../gdrive-auth.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gdrive-storage',
  templateUrl: './gdrive-storage.component.html',
  styleUrls: ['./gdrive-storage.component.css']
})
export class GdriveStorageComponent implements OnInit {
  private gdriveAuthSubscription: Subscription;
  private googleAuth: any;

  constructor(
    private authService: GdriveAuthService,
  ) { }

  ngOnInit(): void {

    this.gdriveAuthSubscription = this.authService
      .getAuth()
      .subscribe(auth => (this.googleAuth = auth));
  }

}
