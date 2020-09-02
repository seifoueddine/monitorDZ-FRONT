import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OurNotificationsService {

  private reloadSlugs = new Subject<any>();
  reloadSlugsNotifier$ = this.reloadSlugs.asObservable();

  private reloadTags = new Subject<any>();
  reloadTagsNotifier$ = this.reloadTags.asObservable();

  private reloadSectors = new Subject<any>();
  reloadSectorsNotifier$ = this.reloadSectors.asObservable();


  private reloadMedia = new Subject<any>();
  reloadMediaNotifier$ = this.reloadMedia.asObservable();

  private reloadCampaigns = new Subject<any>();
  reloadCampaignsNotifier$ = this.reloadCampaigns.asObservable();

  private reloadArticles = new Subject<any>();
  reloadArticlesNotifier$ = this.reloadArticles.asObservable();

  private reloadUsers = new Subject<any>();
  reloadUsersNotifier$ = this.reloadUsers.asObservable();
  
  
  constructor() { }

  notficateReloadSlugs() {
    this.reloadSlugs.next();
  }
  
   notficateReloadTags() {
    this.reloadTags.next();
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

  notficateReloadArticles() {
    this.reloadArticles.next();
  }

  notficateReloadUsers() {
    this.reloadUsers.next();
  }
  
}
