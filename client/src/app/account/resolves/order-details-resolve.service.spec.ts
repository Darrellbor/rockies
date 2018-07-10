import { TestBed, inject } from '@angular/core/testing';

import { OrderDetailsResolveService } from './order-details-resolve.service';

describe('OrderDetailsResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderDetailsResolveService]
    });
  });

  it('should be created', inject([OrderDetailsResolveService], (service: OrderDetailsResolveService) => {
    expect(service).toBeTruthy();
  }));
});
