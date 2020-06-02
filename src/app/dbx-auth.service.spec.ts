import { TestBed } from '@angular/core/testing';

import { DbxAuthService } from './dbx-auth.service';

describe('DbxAuthService', () => {
  let service: DbxAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbxAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
