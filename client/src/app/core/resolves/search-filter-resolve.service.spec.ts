import { TestBed, inject } from '@angular/core/testing';

import { SearchFilterResolveService } from './search-filter-resolve.service';

describe('SearchFilterResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchFilterResolveService]
    });
  });

  it('should be created', inject([SearchFilterResolveService], (service: SearchFilterResolveService) => {
    expect(service).toBeTruthy();
  }));
});
