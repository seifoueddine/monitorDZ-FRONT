import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';

import { NotificationType, NotificationsService } from 'angular2-notifications';


import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthorsService } from 'src/app/shared/services/authors.service';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { Authors } from 'src/app/shared/models/authors.model';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.scss']
})
export class AuthorFormComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };


  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  authorForm: UntypedFormGroup;
  data: any
  types: { id: string; name: string; }[];
  constructor(private modalService: BsModalService,
              private authorService: AuthorsService, private notifications: NotificationsService,
              private ourNotificationService: OurNotificationsService)
               { 
               }

  ngOnInit() {
  }

  show(data?) {
    this.data = data
    this.modalRef = this.modalService.show(this.template, this.config);
    this.createAuthorForm(); 
  }


  createAuthorForm() {
    if (!this.data) {
      this.authorForm = new UntypedFormGroup({
        name: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      });

    } else {
      this.authorForm = new UntypedFormGroup({
        name: new UntypedFormControl(this.data.attributes.name, [Validators.required, Validators.minLength(2)]),
      });
    }
  }


  createAuthor(event) {
    // event.preventDefault();

    if (this.authorForm.valid) {

      if (this.data) {
          const object = new Authors;
          object.id = this.data.id
          object.name = this.authorForm.value.name;
          this.authorService.updateAuthor(object).subscribe(resCreate => {

            this.notifications.create('Success', "Mettre à jour l'auteur avec succès", NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
            this.modalRef.hide();
            this.ourNotificationService.notficateReloadAuthors();
      
          }, err => {
            
            this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

          });
        

      } else {
        const author: Authors = new Authors();
        event.preventDefault();
        author.name = this.authorForm.value.name;
        this.authorService.addAuthor(author).subscribe(resCreate => {
          this.notifications.create('Success', 'Author créé avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
          this.modalRef.hide();
          this.ourNotificationService.notficateReloadAuthors();
        }, error => {
          this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

        });
       
      }
    }
  }

}
