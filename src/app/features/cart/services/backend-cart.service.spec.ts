import { TestBed } from '@angular/core/testing';

import { BackendCartService } from './backend-cart.service';

describe('GuestCartService', () => {
  let service: BackendCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
