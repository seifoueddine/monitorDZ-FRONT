import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MediaService } from 'src/app/shared/services/media.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { Media } from 'src/app/shared/models/media.model';
import { SectorsService } from 'src/app/shared/services/sectors.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-media-form',
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.scss']
})
export class MediaFormComponent implements OnInit {
  newPic = false;
  avatarName: string;
  AvatarToDisplay: any;
  avatarToSend: any;
  urlForImage = environment.URL_PATH; 
  removeCurrentAvatarStatus = false;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };


  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  mediaForm: UntypedFormGroup;
  data: any
  types: { id: string; name: string; }[];
  sectors: any;
  sectorsIds = [];
  digital = false;
  zones = [
    {value: 'national', viewValue: 'National'},
    {value: 'international', viewValue: 'International'},

  ];
  languages = [
    {value: 'fr', viewValue: 'Fr'},
    {value: 'ar', viewValue: 'Ar'},
    {value: 'en', viewValue: 'En'},
  ];
  constructor(private modalService: BsModalService,private sectorService: SectorsService,
              private mediaService: MediaService, private notifications: NotificationsService,
              private ourNotificationService: OurNotificationsService)
               { 
               }

  ngOnInit() {
    // this.getSectors();
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
      this.mediaForm = new UntypedFormGroup({
        name: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
        media_type: new UntypedFormControl(null, [Validators.required]),
        orientation: new UntypedFormControl(null, [Validators.required]),
      //  sector_id: new FormControl(null, [Validators.required]),
        url_crawling: new UntypedFormControl(null),
        avatar: new UntypedFormControl(null),
        zone: new UntypedFormControl(null),
        language: new UntypedFormControl(null),
        tag_status: new UntypedFormControl(true)
      });

    } else {
      this.data.attributes.media_type === 'digital' ? this.digital = true : this.digital = false
      this.sectorsIds = this.data.sectorNameArray;
      this.mediaForm = new UntypedFormGroup({
        name: new UntypedFormControl(this.data.attributes.name, [Validators.required, Validators.minLength(2)]),
        media_type: new UntypedFormControl(this.data.attributes.media_type, [Validators.required]),
        orientation: new UntypedFormControl(this.data.attributes.orientation, [Validators.required]),
     //   sector_id: new FormControl(this.data.sectorNameArray, [Validators.required]),
        url_crawling: new UntypedFormControl(this.data.attributes.url_crawling),
        avatar: new UntypedFormControl(null),
        zone: new UntypedFormControl(this.data.attributes.zone),
        language: new UntypedFormControl(this.data.attributes.language),
        tag_status: new UntypedFormControl(this.data.attributes.tag_status)
      });
    }
  }


  createMedia(event) {
    // event.preventDefault();

    if (this.mediaForm.valid) {

      if (this.data) {
          const mediaId = this.data.id;
          const object = new Media;
          // object.id = this.data.id
          // object.name = this.mediaForm.value.name;
          // object.media_type = this.mediaForm.value.media_type;
          // object.orientation = this.mediaForm.value.orientation;
          // object.url_crawling = this.mediaForm.value.url_crawling;
          // object.sector_id = this.sectorsIds.join(',');
          const formData = new FormData();
        if(this.newPic) {
          formData.append('avatar', this.avatarToSend);
        }
        if(this.removeCurrentAvatarStatus){
          formData.append('avatar', null);
        }

        formData.append('name', this.mediaForm.value.name);
        formData.append('media_type', this.mediaForm.value.media_type);
        formData.append('orientation', this.mediaForm.value.orientation);
        formData.append('url_crawling', this.mediaForm.value.url_crawling);
      //  formData.append('sector_id', this.sectorsIds.join(','));
        formData.append('zone', this.mediaForm.value.zone);
        formData.append('language', this.mediaForm.value.language);
        formData.append('tag_status', this.mediaForm.value.tag_status);
          this.mediaService.updateMedia(formData, mediaId).subscribe(resCreate => {

            this.notifications.create('Success', 'Mettre à jour le média avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
            this.hideModal();
            this.ourNotificationService.notficateReloadMedia();
            this.sectorsIds = [];
          }, err => {
            
            this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

          });
        

      } else {
        event.preventDefault();
        const formData = new FormData();
        formData.append('avatar', this.avatarToSend);
        // const media: Media = new Media();
      
        // media.name = this.mediaForm.value.name;
        // media.media_type = this.mediaForm.value.media_type;
        // media.orientation = this.mediaForm.value.orientation;
        // media.sector_id = this.sectorsIds.join(',');
        // media.url_crawling = this.mediaForm.value.url_crawling;
        formData.append('name', this.mediaForm.value.name);
        formData.append('media_type', this.mediaForm.value.media_type);
        formData.append('orientation', this.mediaForm.value.orientation);
        formData.append('url_crawling', this.mediaForm.value.url_crawling);
       // formData.append('sector_id', this.sectorsIds.join(','));
        formData.append('zone', this.mediaForm.value.zone);
        formData.append('language', this.mediaForm.value.language);
        formData.append('tag_status', this.mediaForm.value.tag_status);
        
        this.mediaService.addMedia(formData).subscribe(resCreate => {
          this.notifications.create('Success', 'Média créé avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
          this.hideModal();
          this.ourNotificationService.notficateReloadMedia();
        }, error => {
          this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

        });
       
      }
    }
  }


  
  
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
    
   
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.AvatarToDisplay = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        let selectedImage = event.target.files[0];
        this.avatarToSend = selectedImage;
        this.avatarName = selectedImage.name;
        this.newPic = true;
        this.removeCurrentAvatarStatus = false;
    }
  }


  removeSelectedFile() {
    // Delete the item from images names list
    this.avatarName = null
    // delete file from images List
    this.avatarToSend = null ;

    this.AvatarToDisplay = null;
  }


  hideModal(){
    this.modalRef.hide();
    this.newPic = false;
    this.avatarName = null;
    this.avatarToSend = null ;
    this.AvatarToDisplay = null;
  }


  removeCurrentAvatar(){
    this.removeCurrentAvatarStatus = true;

      this.avatarName = null

      this.avatarToSend = null ;
  
      this.AvatarToDisplay = null;
  }

  clearAll(){
    this.newPic = false;
    this.avatarName = null;
    this.avatarToSend = null ;
    this.AvatarToDisplay = null;
    this.removeCurrentAvatarStatus = false;
  }

  selectZone(zone) {
    this.mediaForm.value.zone = zone.value;
  }

  selectLang(lan) {
    this.mediaForm.value.language = lan.value;
  }

}
