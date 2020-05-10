import { TestBed, inject } from '@angular/core/testing';

import { ForgotpasswordserviceService } from './forgotpasswordservice.service';

describe('ForgotpasswordserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ForgotpasswordserviceService]
    });
  });

  it('should be created', inject([ForgotpasswordserviceService], (service: ForgotpasswordserviceService) => {
    expect(service).toBeTruthy();
  }));
});
