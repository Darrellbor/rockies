import { TestBed, inject } from '@angular/core/testing';

import { MyReviewsResolveService } from './my-reviews-resolve.service';

describe('MyReviewsResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyReviewsResolveService]
    });
  });

  it('should be created', inject([MyReviewsResolveService], (service: MyReviewsResolveService) => {
    expect(service).toBeTruthy();
  }));
});
