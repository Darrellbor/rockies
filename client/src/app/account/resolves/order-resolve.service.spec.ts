import { TestBed, inject } from '@angular/core/testing';

import { OrderResolveService } from './order-resolve.service';

describe('OrderResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderResolveService]
    });
  });

  it('should be created', inject([OrderResolveService], (service: OrderResolveService) => {
    expect(service).toBeTruthy();
  }));
});
