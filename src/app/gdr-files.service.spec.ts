import { TestBed } from '@angular/core/testing';

import { GdrFilesService } from './gdr-files.service';

describe('GdrFilesService', () => {
  let service: GdrFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GdrFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
