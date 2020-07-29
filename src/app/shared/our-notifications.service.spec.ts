import { TestBed } from '@angular/core/testing';
import { OurNotificationsService } from './our-notifications.service';


describe('OurNotificationsService', () => {
  let service: OurNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OurNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
