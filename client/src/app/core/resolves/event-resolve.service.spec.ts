import { TestBed, inject } from '@angular/core/testing';

import { EventResolveService } from './event-resolve.service';

describe('EventResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventResolveService]
    });
  });

  it('should be created', inject([EventResolveService], (service: EventResolveService) => {
    expect(service).toBeTruthy();
  }));
});
