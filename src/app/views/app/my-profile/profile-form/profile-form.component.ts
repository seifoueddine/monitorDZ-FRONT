import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
// import { MyProfileService } from 'src/app/shared/services/my-profile.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {

  modalRef: BsModalRef;
  configRight = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  avatarName: string;
  newPic = false;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  userForm: FormGroup;
  data: any
  direction: string;
  // roles = [
  //   {value: 'admin', viewValue: 'admin'},
  //   {value: 'agent', viewValue: 'agent'}
  // ];
  AvatarToDisplay: any;
  avatarToSend: any;
  urlForImage = environment.URL_PATH; 
  removeCurrentAvatarStatus = false;
  public options = {
    position: ["bottom", "center"],
}
  constructor(private modalService: BsModalService,
    private userService: UsersService, private notifications: NotificationsService,
    private ourNotificationService: OurNotificationsService) {
    
    
     }

  ngOnInit(): void {
  }

  show(data?) {
    this.data = data
    this.modalRef = this.modalService.show(this.template, this.configRight );
    this.createUserForm();
  }


  createUserForm() {
    if (!this.data) {
     
    } else {
      this.userForm = new FormGroup({
        name: new FormControl(this.data.name, [Validators.required, Validators.minLength(2)]),
        // last_name: new FormControl(this.data.last_name, [Validators.required, Validators.minLength(2)]),
        email: new FormControl(this.data.email, [Validators.email]),
        // phone: new FormControl(this.data.phone, [Validators.required, Validators.minLength(9)]),
        avatar: new FormControl(null),
      });
    }
  }


  createUser(event) {
    // event.preventDefault();

    if (this.userForm.valid) {

      if(this.data){


        const formData = new FormData();
        if(this.newPic) {
          formData.append('avatar', this.avatarToSend);
        }
        if(this.removeCurrentAvatarStatus){
          formData.append('avatar', null);
        }
        formData.append('name', this.userForm.value.first_name);
        // formData.append('last_name', this.userForm.value.last_name);
         formData.append('email', this.userForm.value.email);
        // formData.append('phone', this.userForm.value.phone);
        this.userService.updateUser(formData, ''
      ).subscribe(
        res =>  {
          console.log(res)
       //   localStorage.setItem('user', JSON.stringify(res.data));
          this.ourNotificationService.notficateProfileInfos();
          this.notifications.create('Success', 'Modification des infomartion avec succés  ', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: true });
          this.modalRef.hide();
         this.clearAll();
          // this.ourNotificationService.notficateReloadUsers();
          } ,
          error => { console.log(error)
            this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: true  });
          }
      );
     

      }else {

      //   const formData = new FormData();
      //   formData.append('avatar', this.avatarToSend);
      //   formData.append('name', this.userForm.value.name);
      //   formData.append('email', this.userForm.value.email);
      //   formData.append('password', this.userForm.value.password);
      //   formData.append('role', this.userForm.value.role);
      //   this.userService.addUser(formData
      // ).subscribe(
      //   res =>  {console.log(res)
      //     this.notifications.create('Success', 'create user with success', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: true });
      //     this.modalRef.hide();
      //      this.clearAll();
      //     this.ourNotificationService.notficateReloadUsers();
      //     } ,
      //     error => { console.log(error)
      //       this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: true });
      //     }
      // );
      }

    }
  }

  selectRole(role) {
    this.userForm.value.role = role.value;
  }

  // onFileSelect(event) {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     this.userForm.get('avatar').setValue(file);
  //   }
  // }


  
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


  hideModel(){
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

}
