import { TestBed, inject } from '@angular/core/testing';

import { NewuserService } from './newuser.service';

describe('NewuserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewuserService]
    });
  });

  it('should be created', inject([NewuserService], (service: NewuserService) => {
    expect(service).toBeTruthy();
  }));
});
