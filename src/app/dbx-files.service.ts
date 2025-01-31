import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { DbxAuthService } from './dbx-auth.service';
import { AuthObj } from './auth';
import { Dropbox } from 'dropbox';
import { File } from './file';
import { FileSaver, saveAs } from 'file-saver';

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
    private http: HttpClient,
    // private filesaver: FileSaver,
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
      // console.log(element);
      const dbxFile: File = {
        type: element['.tag'],
        name: element.name,
        path: element.path_lower,
        last_modified: element.server_modified,
        id: element.id,
        storageProvider: 'Dropbox',
      };
      // adding folder and file specific attributes
      if (dbxFile.type === 'folder') {
        dbxFile.type = 'Folder';
        dbxFile.folderNavigationParameter = 'dbx:' + element.path_display;
      } else {
        // console.log(dbxFile);
        dbxFile.size = element.size;
        dbxFile.viewLink = 'https://www.dropbox.com/home' + element.path_lower;
        // dbxFile.fileType = element.path_lower.split('.')[1];
      }

      this.dbxFileStream.next(dbxFile);
    });
  }

  downloadFile(path: string, fileName: string) {
    console.log(fileName);
    console.log(path);
    const reqHeader = new HttpHeaders({
      authorization: ' Bearer ' + this.dbxAuth.accessToken,
      'Dropbox-API-Arg': `{\"path\": \"${path}"}`
    });
    // console.log(reqHeader);
    // const reqParams = new HttpParams().set('path', path);
    // console.log(reqParams);
    this.http.post('https://content.dropboxapi.com/2/files/download',
      '',
      { headers: reqHeader,
      responseType: 'blob'}
    )
      .subscribe(fileDownload => {
        console.log('---DBX fileservice: download DBX file---');
        // console.log(fileDownload);
        saveAs(fileDownload, fileName);
      });
  }
}
