import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';

import { NotificationType, NotificationsService } from 'angular2-notifications';
import { Slugs } from 'src/app/shared/models/slugs.model';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SlugsService } from 'src/app/shared/services/slugs.service';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';

@Component({
  selector: 'app-slug-form',
  templateUrl: './slug-form.component.html',
  styleUrls: ['./slug-form.component.scss']
})
export class SlugFormComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };


  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  slugForm: UntypedFormGroup;
  data: any
  types: { id: string; name: string; }[];
  constructor(private modalService: BsModalService,
              private slugService: SlugsService, private notifications: NotificationsService,
              private ourNotificationService: OurNotificationsService)
               { 
               }

  ngOnInit() {
  }

  show(data?) {
    this.data = data
    this.modalRef = this.modalService.show(this.template, this.config);
    this.createSlugForm(); 
  }


  createSlugForm() {
    if (!this.data) {
      this.slugForm = new UntypedFormGroup({
        name: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      });

    } else {
      this.slugForm = new UntypedFormGroup({
        name: new UntypedFormControl(this.data.attributes.name, [Validators.required, Validators.minLength(2)]),
      });
    }
  }


  createSlug(event) {
    // event.preventDefault();

    if (this.slugForm.valid) {

      if (this.data) {
          const object = new Slugs;
          object.id = this.data.id
          object.name = this.slugForm.value.name;
          this.slugService.updateSlug(object).subscribe(resCreate => {

            this.notifications.create('Success', 'Mettre à jour le slug avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
            this.modalRef.hide();
            this.ourNotificationService.notficateReloadSlugs();
      
          }, err => {
            
            this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

          });
        

      } else {
        const slug: Slugs = new Slugs();
        event.preventDefault();
        slug.name = this.slugForm.value.name;
        this.slugService.addSlug(slug).subscribe(resCreate => {
          this.notifications.create('Success', 'Slug créé avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
          this.modalRef.hide();
          this.ourNotificationService.notficateReloadSlugs();
        }, error => {
          this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

        });
       
      }
    }
  }

}
