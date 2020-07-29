import { TestBed } from '@angular/core/testing';

import { DbxFilesService } from './dbx-files.service';

describe('DbxFilesService', () => {
  let service: DbxFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbxFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
