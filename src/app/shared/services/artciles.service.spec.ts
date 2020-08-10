import { TestBed } from '@angular/core/testing';

import { ArtcilesService } from './artciles.service';

describe('ArtcilesService', () => {
  let service: ArtcilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtcilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
