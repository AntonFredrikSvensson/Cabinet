import { File } from './file';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { GdriveAuthService } from './gdrive-auth.service';
import { Subscription, Subject } from 'rxjs';
import { AuthObj } from './auth';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GdrFilesService {
  private gdrAuth: AuthObj;
  private gdrSubscription: Subscription;
  public gdrFileStream: Subject<File>;

  constructor(
    private gdrAuthService: GdriveAuthService,
    private http: HttpClient,
  ) {
    this.gdrSubscription = this.gdrAuthService
      .getAuth()
      .subscribe(auth => (this.gdrAuth = auth));

    this.gdrFileStream = new Subject<File>();
  }

  getGdrFiles(folderId) {
    // console.log('---get Gdr files---');
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.gdrAuth.accessToken
    });
    const searchParameter = `'` + folderId + `' in parents`;
    const reqParams = new HttpParams().set('q', searchParameter);
    return this.http.get<any>('https://www.googleapis.com/drive/v2/files/',
      {
        headers: reqHeader,
        params: reqParams
      }
    )
      .subscribe(filesObject => this.gdrFilesListObjectToItemList(filesObject));
  }

  gdrFilesListObjectToItemList(filesObject) {
    // console.log('---tempFunction---');
    // console.log(filesObject);
    let i;
    for (i = 0; i < 10; i++) {
      let nextPageToken = filesObject.nextPageToken;
      if (nextPageToken) {
        const newreqHeader = new HttpHeaders({
          Authorization: 'Bearer ' + this.gdrAuth.accessToken
        });
        // const httpParams: HttpParamsOptions = { fromObject: myObject } as HttpParamsOptions;
        const reqParams = new HttpParams().set('pageToken', filesObject.nextPageToken);
        // console.log(filesObject.nextPageToken);
        this.http.get<any>('https://www.googleapis.com/drive/v2/files?' + this.gdrAuth.accessToken,
          { headers: newreqHeader, params: reqParams }
        )
          .subscribe(newFilesObject => {
            // console.log(newFilesObject);
            nextPageToken = newFilesObject.nextPageToken;
          });
      }
      else {
        break;
      }
    }
    this.gdrEntriesToFiles(filesObject.items);
    return filesObject;
  }

  gdrEntriesToFiles(entries) {
    // console.log('---gdrEntriesToFiles---');
    // entries.forEach(FileElement => {
    //   console.log(FileElement);
    //   this.getSingleGdrFile(FileElement.id);
    // });
    entries.forEach(element => {
      const gdrFile: File = {
        type: '',
        name: element.title,
        last_modified: element.modifiedDate,
        id: element.id,
        storageProvider: 'Google Drive',
      };
      // setting folder and file specific attributes
      if (element.mimeType === 'application/vnd.google-apps.folder') {
        gdrFile.folderNavigationParameter = 'gdr:' + element.id;
        gdrFile.type = 'Folder';
      } else {
        gdrFile.size = element.fileSize;
        gdrFile.type = 'file';
      }
      // console.log(gdrFile);
      this.gdrFileStream.next(gdrFile);

    });
  }
}
