import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TagsService } from 'src/app/shared/services/tags.service';
import { UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Tags } from 'src/app/shared/models/tags.model';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss']
})
export class TagFormComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };


  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  tagForm: UntypedFormGroup;
  data: any
  types: { id: string; name: string; }[];
  constructor(private modalService: BsModalService,
              private tagService: TagsService, private notifications: NotificationsService,
              private ourNotificationService: OurNotificationsService)
               { 
               }

  ngOnInit() {
  }

  show(data?) {
    this.data = data
    this.modalRef = this.modalService.show(this.template, this.config);
    this.createTagForm(); 
  }


  createTagForm() {
    if (!this.data) {
      this.tagForm = new UntypedFormGroup({
        name: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      });

    } else {
      this.tagForm = new UntypedFormGroup({
        name: new UntypedFormControl(this.data.attributes.name, [Validators.required, Validators.minLength(2)]),
      });
    }
  }


  createTag(event) {
    // event.preventDefault();

    if (this.tagForm.valid) {

      if (this.data) {
          const object = new Tags;
          object.id = this.data.id
          object.name = this.tagForm.value.name;
          this.tagService.updateTag(object).subscribe(resCreate => {

            this.notifications.create('Success', 'Mettre à jour le tag avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
            this.modalRef.hide();
            this.ourNotificationService.notficateReloadTags();
      
          }, err => {
            
            if (err.error.code == 'E001'){
              this.notifications.create('Erreur', 'Tag existe déja', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
  
            }else {
              this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
  
            }
          });
        

      } else {
        const tag: Tags = new Tags();
        event.preventDefault();
        tag.name = this.tagForm.value.name;
        this.tagService.addTag(tag).subscribe(resCreate => {
          this.notifications.create('Success', 'Tag créé avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
          this.modalRef.hide();
          this.ourNotificationService.notficateReloadTags();
        }, err => {
          if (err.error.code == 'E001'){
            this.notifications.create('Erreur', 'Tag existe déja', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

          }else {
            this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

          }

        });
       
      }
    }
  }

}
