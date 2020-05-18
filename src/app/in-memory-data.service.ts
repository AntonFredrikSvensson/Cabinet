import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { File } from './file';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService {
  createDb() {
    const files = [
      {
      id: 11,
      name: 'in mem folder 1',
      size: 123,
      type: 'Folder',
      lastmodified: '2019-12-24 15:00',
      platform: 'Dropbox',
    }, {
      id: 12,
      name: 'file from in mem 2',
      size: 45,
      type: 'doc',
      lastmodified: '2019-12-31 23:59',
      platform: 'OneDrive',
    },
    {
      id:13,
      name: 'third file from in mem',
      size: 6789,
      type: 'jpg',
      lastmodified: '2020-01-01 00:01',
      platform: 'Google Drive',
    }
  ];
    return {files};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(files: File[]): number {
    return files.length > 0 ? Math.max(...files.map(file => file.id)) + 1 : 11;
  }
}
