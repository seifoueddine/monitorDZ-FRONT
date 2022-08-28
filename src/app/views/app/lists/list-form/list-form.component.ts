import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ListsService } from 'src/app/shared/services/lists.service';
import { Lists } from 'src/app/shared/models/lists.model';
import { images } from 'src/app/shared/images';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true, 
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  images = images.IMAGES
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  listForm: UntypedFormGroup;
  data: any
  types: { id: string; name: string; }[];
  constructor(private modalService: BsModalService,
              private listService: ListsService, private notifications: NotificationsService,
              private ourNotificationService: OurNotificationsService)
               {   
               }

  ngOnInit() {
  }

  show(data?) {
    this.data = data
    this.modalRef = this.modalService.show(this.template, this.config);
    this.createListForm(); 
  }


  createListForm() {
    if (!this.data) {
      this.listForm = new UntypedFormGroup({
        name: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
        image: new UntypedFormControl(null),
      });

    } else {
      this.listForm = new UntypedFormGroup({
        name: new UntypedFormControl(this.data.attributes.name, [Validators.required, Validators.minLength(2)]),
        image: new UntypedFormControl(this.data.attributes.image),
      });
    }
  }


  createList(event) {
    // event.preventDefault();

    if (this.listForm.valid) {

      if (this.data) {
          const object = new Lists;
          object.id = this.data.id
          object.name = this.listForm.value.name;
          object.image = this.listForm.value.image;
          this.listService.updateList(object).subscribe(resCreate => {

            this.notifications.create('Success', 'Mettre à jour le list avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
            this.modalRef.hide();
            this.ourNotificationService.notficateReloadLists();
      
          }, err => {
            
            if (err.error.code == 'E001'){
              this.notifications.create('Erreur', 'List existe déja', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
  
            }else {
              this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
  
            }
          });
        

      } else {
        const list: Lists = new Lists();
        event.preventDefault();
        list.name = this.listForm.value.name;
        list.image = this.listForm.value.image;
        this.listService.addList(list).subscribe(resCreate => {
          this.notifications.create('Success', 'List créé avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
          this.modalRef.hide();
          this.ourNotificationService.notficateReloadLists();
        }, err => {
          if (err.error.code == 'E001'){
            this.notifications.create('Erreur', 'List existe déja', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

          }else {
            this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

          }

        });
       
      }
    }
  }
}
