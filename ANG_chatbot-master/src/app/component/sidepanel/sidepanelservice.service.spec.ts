import { TestBed, inject } from '@angular/core/testing';

import { SidepanelserviceService } from './sidepanelservice.service';

describe('SidepanelserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidepanelserviceService]
    });
  });

  it('should be created', inject([SidepanelserviceService], (service: SidepanelserviceService) => {
    expect(service).toBeTruthy();
  }));
});
