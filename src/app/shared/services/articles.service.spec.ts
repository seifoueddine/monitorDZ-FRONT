import { TestBed } from '@angular/core/testing';

import { ArtcilesService } from './artciles.service';

describe('ArtcilesService', () => {
  let service: ArticlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
