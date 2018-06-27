import { TestBed, inject } from '@angular/core/testing';

import { OrganizerResolveService } from './organizer-resolve.service';

describe('OrganizerResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizerResolveService]
    });
  });

  it('should be created', inject([OrganizerResolveService], (service: OrganizerResolveService) => {
    expect(service).toBeTruthy();
  }));
});
