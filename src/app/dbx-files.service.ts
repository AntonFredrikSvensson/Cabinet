import { Injectable } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { DbxAuthService } from './dbx-auth.service';
import { AuthObj } from './auth';
import { Dropbox } from 'dropbox';
import { File } from './file';

@Injectable({
  providedIn: 'root'
})
export class DbxFilesService {
  private dbxAuth: AuthObj;
  private dbxSubscription: Subscription;
  dbx;
  public dbxFileStream: Subject<File>;

  constructor(
    private dbxAuthService: DbxAuthService,
    // private http: HttpClient,
  ) {
    this.dbxSubscription = this.dbxAuthService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    this.dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });

    this.dbxFileStream = new Subject<File>();
  }

  getDbxFiles(path) {
    // console.log(path);
    // path = path.substring(6);
    this.dbx.filesListFolder({ path: decodeURI(path) })
      .then(response => {
        const entries = response.entries;
        this.dbxEntriesToFiles(entries);
      });
  }
  dbxEntriesToFiles(entries) {
    entries.forEach(element => {
      console.log(element);
      const dbxFile: File = {
        type: element['.tag'],
        name: element.name,
        path: element.path_display,
        last_modified: element.server_modified,
        id: element.id,
        storageProvider: 'Dropbox',
      };
      // adding folder and file specific attributes
      if (dbxFile.type === 'folder') {
        dbxFile.type = 'Folder';
        dbxFile.folderNavigationParameter = 'dbx:' + element.path_display;
      } else {
        console.log(dbxFile);
        dbxFile.size = element.size;
        dbxFile.viewLink = 'https://www.dropbox.com/home/' + element.path_lower;
      }


      this.dbxFileStream.next(dbxFile);
    });
  }
}
