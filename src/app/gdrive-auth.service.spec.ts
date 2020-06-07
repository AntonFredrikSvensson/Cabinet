import { TestBed } from '@angular/core/testing';

import { GdriveAuthService } from './gdrive-auth.service';

describe('GdriveAuthService', () => {
  let service: GdriveAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GdriveAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
