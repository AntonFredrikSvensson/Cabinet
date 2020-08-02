import { TestBed } from '@angular/core/testing';

import { HttpCasheService } from './http-cashe.service';

describe('HttpCasheService', () => {
  let service: HttpCasheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCasheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
