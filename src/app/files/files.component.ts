import { Component, OnInit } from '@angular/core';

import { File } from '../file';
import { FileService } from '../file.service';
import { MessageService } from '../message.service';
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
  private subscription: Subscription;

  constructor(private authService: DbxAuthService,private fileService: FileService, private messageService: MessageService) { }



  files: File[];

  ngOnInit(): void {
    this.getFiles();
    this.subscription = this.authService.getAuth()
    .subscribe((auth) => this.dbxAuth = auth);
  }

  getFiles(): void {
    this.fileService.getFiles()
      .subscribe(files => this.files = files)
  }

}
