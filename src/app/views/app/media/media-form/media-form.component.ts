import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MediaService } from 'src/app/shared/services/media.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Media } from 'src/app/shared/models/media.model';

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
  constructor(private modalService: BsModalService,
              private mediaService: MediaService, private notifications: NotificationsService,
              private ourNotificationService: OurNotificationsService)
               { 
               }

  ngOnInit() {
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
        type: new FormControl(null, [Validators.required]),
        orientation: new FormControl(null, [Validators.required]),
      });

    } else {
      this.mediaForm = new FormGroup({
        name: new FormControl(this.data.attributes.name, [Validators.required, Validators.minLength(2)]),
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
          object.type = this.mediaForm.value.type;
          object.orientation = this.mediaForm.value.orientation;
          this.mediaService.updateMedia(object).subscribe(resCreate => {

            this.notifications.create('Success', 'Mettre à jour le média avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
            this.modalRef.hide();
            this.ourNotificationService.notficateReloadMedia();
      
          }, err => {
            
            this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

          });
        

      } else {
        const media: Media = new Media();
        event.preventDefault();
        media.name = this.mediaForm.value.name;
        media.type = this.mediaForm.value.type;
        media.orientation = this.mediaForm.value.orientation;
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
