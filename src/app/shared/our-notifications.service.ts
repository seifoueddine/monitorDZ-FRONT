import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OurNotificationsService {

  private reloadSlugs = new Subject<any>();
  reloadSlugsNotifier$ = this.reloadSlugs.asObservable();

  private reloadSectors = new Subject<any>();
  reloadSectorsNotifier$ = this.reloadSectors.asObservable();


  private reloadMedia = new Subject<any>();
  reloadMediaNotifier$ = this.reloadMedia.asObservable();

  private reloadCampaigns = new Subject<any>();
  reloadCampaignsNotifier$ = this.reloadCampaigns.asObservable();
  
  constructor() { }

  notficateReloadSlugs() {
    this.reloadSlugs.next();
  }

   notficateReloadSectors() {
    this.reloadSectors.next();
  }

  notficateReloadMedia() {
    this.reloadMedia.next();
  }

  notficateReloadCampaigns() {
    this.reloadCampaigns.next();
  }
}
