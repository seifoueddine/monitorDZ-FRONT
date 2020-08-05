import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SectorsService } from 'src/app/shared/services/sectors.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { CampaignsService } from 'src/app/shared/services/campaigns.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Campaigns } from 'src/app/shared/models/campaigns.model';
import { SlugsService } from 'src/app/shared/services/slugs.service';
import { MediaService } from 'src/app/shared/services/media.service';

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss']
})
export class CampaignFormComponent implements OnInit {

 
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };


  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  campaignForm: FormGroup;
  data: any
  types: { id: string; name: string; }[];
  sectors: any;
  sectorsIds = [];
  slugs: any;
  media: any;
  mediaIds = [];
  constructor(private modalService: BsModalService,private sectorsService: SectorsService,private slugsService: SlugsService,
              private campaignsService: CampaignsService, private notifications: NotificationsService,
              private ourNotificationService: OurNotificationsService,private mediaService: MediaService)
               { 
               }

  ngOnInit() {
    this.getSectors();
    this.getSlugs();
    this.getMedia();
  }


  getSectors(){
    this.sectorsService.getSectors(1, 'created_at' , 'desc', 9999, '').subscribe(
      data => {
        if (data.status) {
 
          const resp = data.body;
          this.sectors = resp.data
        }
      },
      error => {
        this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      }
    );
  }


  getSlugs(){
    this.slugsService.getSlugs(1, 'created_at' , 'desc', 9999, '').subscribe(
      data => {
        if (data.status) {
 
          const resp = data.body;
          this.slugs = resp.data
        }
      },
      error => {
        this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      }
    );
  }

  getMedia(){
    this.mediaService.getMedia(1, 'created_at' , 'desc', 9999, '').subscribe(
      data => {
        if (data.status) {
 
          const resp = data.body;
          this.media = resp.data
        }
      },
      error => {
        this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      }
    );
  }

   
  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.name.toLocaleLowerCase().indexOf(term) > -1
  }

  customSearchSlug(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.name.toLocaleLowerCase().indexOf(term) > -1
  }
  
  selectSector(event){
    this.sectorsIds = [];
    const sectorsArray = event;
    sectorsArray.map(s=> this.sectorsIds.push(s.id));
    console.log(this.sectorsIds);
  }

  selectMedia(event){
    this.mediaIds = [];
    const mediaArray = event;
    mediaArray.map(s=> this.mediaIds.push(s.id));
    console.log(this.mediaIds);
  }
  

  show(data?) { 
    this.data = data
    this.modalRef = this.modalService.show(this.template, this.config);
    this.createCampaignForm(); 
  }


  createCampaignForm() {
    if (!this.data) {
      this.campaignForm = new FormGroup({
        name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        slug_id: new FormControl(null, [Validators.required]),
        sector_id: new FormControl(null, [Validators.required]),
        media_id: new FormControl(null, [Validators.required]),
      });

    } else {
      this.mediaIds = this.data.mediaNameArray ;
     this.sectorsIds= this.data.sectorNameArray;
      this.campaignForm = new FormGroup({
        name: new FormControl(this.data.attributes.name, [Validators.required, Validators.minLength(2)]),
        slug_id: new FormControl(String(this.data.attributes.slug_id), [Validators.required]),
        sector_id: new FormControl(this.data.sectorNameArray, [Validators.required]),
        media_id: new FormControl(this.data.mediaNameArray, [Validators.required]),
      });
    }
  }


  createCampaign(event) {
    // event.preventDefault();

    if (this.campaignForm.valid) {

      if (this.data) {
          const object = new Campaigns;
          object.id = this.data.id
          object.name = this.campaignForm.value.name;
          object.slug_id = this.campaignForm.value.slug_id;
          object.sector_id = this.sectorsIds.join(',');
          object.media_id = this.mediaIds.join(',');
          this.campaignsService.updateCampaign(object).subscribe(resCreate => {

            this.notifications.create('Success', 'Mettre à jour le média avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
            this.modalRef.hide();
            this.ourNotificationService.notficateReloadCampaigns();
      
          }, err => {
            
            this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

          });
        

      } else {
        const campaign: Campaigns = new Campaigns();
        event.preventDefault();
        campaign.name = this.campaignForm.value.name;
        campaign.slug_id = this.campaignForm.value.slug_id;
        campaign.sector_id = this.sectorsIds.join(',');
        campaign.media_id = this.mediaIds.join(',');
        this.campaignsService.addCampaign(campaign).subscribe(resCreate => {
          console.log(resCreate);
          this.notifications.create('Success', 'Campaigne créé avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
          this.modalRef.hide();
          this.ourNotificationService.notficateReloadCampaigns();
          this.sectorsIds = [];
          this.mediaIds = [];
        }, error => {
          this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

        });
       
      }
    }
  }

}
