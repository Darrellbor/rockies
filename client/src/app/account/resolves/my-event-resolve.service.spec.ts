import { TestBed, inject } from '@angular/core/testing';

import { MyEventResolveService } from './my-event-resolve.service';

describe('MyEventResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyEventResolveService]
    });
  });

  it('should be created', inject([MyEventResolveService], (service: MyEventResolveService) => {
    expect(service).toBeTruthy();
  }));
});
