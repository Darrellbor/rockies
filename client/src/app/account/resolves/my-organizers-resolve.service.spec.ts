import { TestBed, inject } from '@angular/core/testing';

import { MyOrganizersResolveService } from './my-organizers-resolve.service';

describe('MyOrganizersResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyOrganizersResolveService]
    });
  });

  it('should be created', inject([MyOrganizersResolveService], (service: MyOrganizersResolveService) => {
    expect(service).toBeTruthy();
  }));
});
