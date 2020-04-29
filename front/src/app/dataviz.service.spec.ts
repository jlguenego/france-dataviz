import { TestBed } from '@angular/core/testing';

import { DatavizService } from './dataviz.service';

describe('DatavizService', () => {
  let service: DatavizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatavizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
