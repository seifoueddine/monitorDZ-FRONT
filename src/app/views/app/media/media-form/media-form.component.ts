import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MediaService } from 'src/app/shared/services/media.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Media } from 'src/app/shared/models/media.model';
import { SectorsService } from 'src/app/shared/services/sectors.service';

@Component({
  selector: 'app-media-form',
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.scss']
})
export class MediaFormComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };


  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  mediaForm: FormGroup;
  data: any
  types: { id: string; name: string; }[];
  sectors: any;
  sectorsIds = [];
  digital = false;
  constructor(private modalService: BsModalService,private sectorService: SectorsService,
              private mediaService: MediaService, private notifications: NotificationsService,
              private ourNotificationService: OurNotificationsService)
               { 
               }

  ngOnInit() {
    this.getSectors();
  }


  getSectors(){
    this.sectorService.getSectors(1, 'created_at' , 'desc', 9999, '').subscribe(
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

   
  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.name.toLocaleLowerCase().indexOf(term) > -1
  }
  selectSector(event){
    this.sectorsIds = [];
    const sectorsArray = event;
    sectorsArray.map(s=> this.sectorsIds.push(s.id));
    console.log(this.sectorsIds);
  }

  selectType(event){

   event === 'digital' ? this.digital = true : this.digital = false
    
  }

  show(data?) { 
    this.data = data
    this.modalRef = this.modalService.show(this.template, this.config);
    this.createMediaForm(); 
  }


  createMediaForm() {
    if (!this.data) {
      this.mediaForm = new FormGroup({
        name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        media_type: new FormControl(null, [Validators.required]),
        orientation: new FormControl(null, [Validators.required]),
        sector_id: new FormControl(null, [Validators.required]),
        url_crawling: new FormControl(null),
      });

    } else {
      this.data.attributes.media_type === 'digital' ? this.digital = true : this.digital = false
      this.sectorsIds = this.data.sectorNameArray;
      this.mediaForm = new FormGroup({
        name: new FormControl(this.data.attributes.name, [Validators.required, Validators.minLength(2)]),
        media_type: new FormControl(this.data.attributes.media_type, [Validators.required]),
        orientation: new FormControl(this.data.attributes.orientation, [Validators.required]),
        sector_id: new FormControl(this.data.sectorNameArray, [Validators.required]),
        url_crawling: new FormControl(this.data.attributes.url_crawling)
      });
    }
  }


  createMedia(event) {
    // event.preventDefault();

    if (this.mediaForm.valid) {

      if (this.data) {
          const object = new Media;
          object.id = this.data.id
          object.name = this.mediaForm.value.name;
          object.media_type = this.mediaForm.value.media_type;
          object.orientation = this.mediaForm.value.orientation;
          object.url_crawling = this.mediaForm.value.url_crawling;
          object.sector_id = this.sectorsIds.join(',');
          this.mediaService.updateMedia(object).subscribe(resCreate => {

            this.notifications.create('Success', 'Mettre à jour le média avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
            this.modalRef.hide();
            this.ourNotificationService.notficateReloadMedia();
            this.sectorsIds = [];
          }, err => {
            
            this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

          });
        

      } else {
        const media: Media = new Media();
        event.preventDefault();
        media.name = this.mediaForm.value.name;
        media.media_type = this.mediaForm.value.media_type;
        media.orientation = this.mediaForm.value.orientation;
        media.sector_id = this.sectorsIds.join(',');
        media.url_crawling = this.mediaForm.value.url_crawling;
        this.mediaService.addMedia(media).subscribe(resCreate => {
          console.log(resCreate);
          this.notifications.create('Success', 'Média créé avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
          this.modalRef.hide();
          this.ourNotificationService.notficateReloadMedia();
        }, error => {
          this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

        });
       
      }
    }
  }

}
