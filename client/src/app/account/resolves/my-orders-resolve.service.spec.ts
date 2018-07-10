import { TestBed, inject } from '@angular/core/testing';

import { MyOrdersResolveService } from './my-orders-resolve.service';

describe('MyOrdersResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyOrdersResolveService]
    });
  });

  it('should be created', inject([MyOrdersResolveService], (service: MyOrdersResolveService) => {
    expect(service).toBeTruthy();
  }));
});
