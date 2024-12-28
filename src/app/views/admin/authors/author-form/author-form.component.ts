import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';

import { NotificationType, NotificationsService } from 'angular2-notifications';


import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthorsService } from 'src/app/shared/services/authors.service';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { Authors } from 'src/app/shared/models/authors.model';
import { MediaService } from 'src/app/shared/services/media.service';

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
  media: any;
  constructor(private modalService: BsModalService,
              private authorService: AuthorsService, private notifications: NotificationsService, private mediaService: MediaService,
              private ourNotificationService: OurNotificationsService)
               { 
               }

  ngOnInit() {
    this.getMedia();
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
        medium_id: new UntypedFormControl(null, [Validators.required]),
      });

    } else {
     
      this.authorForm = new UntypedFormGroup({
        name: new UntypedFormControl(this.data.attributes.name, [Validators.required, Validators.minLength(2)]),
        medium_id: new UntypedFormControl(String(this.data.attributes.medium_id), [Validators.required]),
      });
    }
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.name.toLocaleLowerCase().indexOf(term) > -1
  }

  selectMedia(event){
   const media = event;
   this.authorForm.get('medium_id').setValue(event.id)
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
  


  createAuthor(event) {
    // event.preventDefault();

    if (this.authorForm.valid) {

      if (this.data) {
          const object = new Authors;
          object.id = this.data.id
          object.name = this.authorForm.value.name;
          object.medium_id = this.authorForm.value.medium_id;
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
        author.medium_id = this.authorForm.value.medium_id;
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
