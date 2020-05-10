import { TestBed, inject } from '@angular/core/testing';

import { GroupchatService } from './groupchat.service';

describe('GroupchatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupchatService]
    });
  });

  it('should be created', inject([GroupchatService], (service: GroupchatService) => {
    expect(service).toBeTruthy();
  }));
});
