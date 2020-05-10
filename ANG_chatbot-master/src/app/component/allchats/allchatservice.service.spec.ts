import { TestBed, inject } from '@angular/core/testing';

import { AllchatserviceService } from './allchatservice.service';

describe('AllchatserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllchatserviceService]
    });
  });

  it('should be created', inject([AllchatserviceService], (service: AllchatserviceService) => {
    expect(service).toBeTruthy();
  }));
});
