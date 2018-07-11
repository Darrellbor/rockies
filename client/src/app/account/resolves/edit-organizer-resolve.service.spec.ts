import { TestBed, inject } from '@angular/core/testing';

import { EditOrganizerResolveService } from './edit-organizer-resolve.service';

describe('EditOrganizerResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditOrganizerResolveService]
    });
  });

  it('should be created', inject([EditOrganizerResolveService], (service: EditOrganizerResolveService) => {
    expect(service).toBeTruthy();
  }));
});
