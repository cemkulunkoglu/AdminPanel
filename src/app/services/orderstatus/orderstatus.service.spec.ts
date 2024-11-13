import { TestBed } from '@angular/core/testing';

import { OrderStatusService } from './orderstatus.service';

describe('StatusService', () => {
  let service: OrderStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
