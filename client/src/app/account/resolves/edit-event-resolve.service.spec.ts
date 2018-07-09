import { TestBed, inject } from '@angular/core/testing';

import { EditEventResolveService } from './edit-event-resolve.service';

describe('EditEventResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditEventResolveService]
    });
  });

  it('should be created', inject([EditEventResolveService], (service: EditEventResolveService) => {
    expect(service).toBeTruthy();
  }));
});
