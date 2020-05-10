import { TestBed, inject } from '@angular/core/testing';

import { ChathistoryService } from './chathistory.service';

describe('ChathistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChathistoryService]
    });
  });

  it('should be created', inject([ChathistoryService], (service: ChathistoryService) => {
    expect(service).toBeTruthy();
  }));
});
