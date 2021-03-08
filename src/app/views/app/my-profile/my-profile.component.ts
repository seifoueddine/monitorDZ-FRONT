
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Lightbox } from 'ngx-lightbox';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { environment } from 'src/environments/environment';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { UsersService } from 'src/app/shared/services/users.service';
const checkPasswords: ValidatorFn = (fg: FormGroup) => {
  const pass = fg.get('password').value;
  const confirmPass = fg.get('password_confirmation').value;

  return pass === confirmPass ? null : { notSame: true } 
}
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {


  user: any;
  slug: any;
  avatarUrl: any;
  staticPic = "/assets/img/avatar.png";
  urlForImage = environment.URL_PATH; 
  modalChangePasswordRef: BsModalRef;
  config = {
    animated: true
  };
  changePasswordForm: FormGroup;
  UserToChangePassword: any;
   @ViewChild('editModalRef', { static: true }) editModalRef: ProfileFormComponent;
  constructor(private modalService: BsModalService, private route: ActivatedRoute,
       private userService: UsersService,

              private lightbox: Lightbox, private notifications: NotificationsService, private ourNotificationService: OurNotificationsService,
              ) { 
                const user = localStorage.getItem('user');
                const userObject =  JSON.parse(user);
                if (userObject) {
                  this.user = userObject;
                  this.avatarUrl = userObject.avatar.url;
                  
                }            


    
   }

  ngOnInit(): void {
    this.listenToNotifier();
  }


  listenToNotifier() {
    this.ourNotificationService.reloadProfileInfoNotifier$.subscribe(res => {
  
      const user = localStorage.getItem('user');
      const userObject =  JSON.parse(user);
      if (userObject) {
        this.user = userObject;
        this.avatarUrl = userObject.image;
       
      }            

    
    });
  }


  openLightbox(src: string): void {
    this.lightbox.open([{ src, thumb: '' }], 0, { centerVertically: true, positionFromTop: 0, disableScrolling: true, wrapAround: true });
  }


  openChangePasswordModal(template: TemplateRef<any>) {
     this.UserToChangePassword = this.user.id;
    this.modalChangePasswordRef = this.modalService.show(template, this.config);
    this.createChangePasswordForm();
  }
  
  openEditAccountModal(){
    this.editModalRef.show(this.user);
  }
  
  
  createChangePasswordForm() {
      this.changePasswordForm = new FormGroup({
        password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        password_confirmation: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      },checkPasswords);
  
  }
  
  changePassword(event) {
    // event.preventDefault();
  
    if (this.changePasswordForm.valid) {
        event.preventDefault();
        const object: any = {}
         object.id = this.UserToChangePassword;
        object.password = this.changePasswordForm.value.password;
        object.password_confirmation = this.changePasswordForm.value.password_confirmation;
        this.userService.changePassword(object).subscribe(resCreate => {
          console.log(resCreate);
          this.notifications.create('Success', 'Changement du mot de passe avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
          this.modalChangePasswordRef.hide();
        }, error => {
          this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
  
        });
       
      
    }
  }


 


}
