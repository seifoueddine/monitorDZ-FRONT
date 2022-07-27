import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UsersService } from "src/app/shared/services/users.service";
import { NotificationsService, NotificationType } from "angular2-notifications";
import { OurNotificationsService } from "src/app/shared/our-notifications.service";
import { LangService } from "src/app/shared/lang.service";
import { environment } from "src/environments/environment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { SlugsService } from "src/app/shared/services/slugs.service";

@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent implements OnInit {
  modalRef: BsModalRef;
  configRight = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: "modal-right",
  };
  configLeft = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: "modal-left",
  };
  avatarName: string;
  newPic = false;
  @ViewChild("template", { static: true }) template: TemplateRef<any>;
  userForm: FormGroup;
  data: any;
  direction: string;
  roles = [
    { value: "GodLike", viewValue: "GodLike" },
    { value: "SuperOP", viewValue: "SuperOP" },
    { value: "Partner", viewValue: "Partner" },
    { value: "ClientAdmin", viewValue: "ClientAdmin" },
    { value: "ClientOP", viewValue: "ClientOP" },
  ];
  AvatarToDisplay: any;
  avatarToSend: any;
  urlForImage = environment.URL_PATH;
  removeCurrentAvatarStatus = false;
  public options = {
    position: ["bottom", "center"],
  };
  allSlugs: any = [];
  constructor(
    private modalService: BsModalService,
    private userService: UsersService,
    private notifications: NotificationsService,
    private slugsService: SlugsService,
    private ourNotificationService: OurNotificationsService,
    private langService: LangService
  ) {
    this.direction = this.langService.direction;
  }

  ngOnInit(): void {
    this.getAllSlugs();
  }

  show(data?) {
    this.data = data;
    this.modalRef = this.modalService.show(
      this.template,
      this.direction === "ltr" ? this.configRight : this.configLeft
    );
    this.createUserForm();
  }

  createUserForm() {
    if (!this.data) {
      this.userForm = new FormGroup({
        name: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
        ]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        // last_name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        role: new FormControl("ClientAdmin", Validators.required),
        avatar: new FormControl(null),
        //  registration_number: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        // function: new FormControl(null, [Validators.required]),
        //  status: new FormControl(true),
        slug_id: new FormControl(null, Validators.required),
      });
    } else {
      this.userForm = new FormGroup({
        name: new FormControl(this.data.attributes.name, [
          Validators.required,
          Validators.minLength(2),
        ]),
        email: new FormControl(this.data.attributes.email, [
          Validators.required,
          Validators.email,
        ]),
        // last_name: new FormControl(this.data.attributes.LastName, [Validators.required, Validators.minLength(2)]),
        role: new FormControl(this.data.attributes.role, Validators.required),
        avatar: new FormControl(null),
        //  registration_number: new FormControl(this.data.attributes.RegistrationNumber, [Validators.required, Validators.minLength(2)]),
        // function: new FormControl(this.data.attributes.Function, [Validators.required,]),
        //  status: new FormControl(this.data.attributes.Status),
        slug_id: new FormControl(
          String(this.data.attributes.slug_id),
          Validators.required
        ),
      });
    }
  }

  createUser(event) {
    // event.preventDefault();

    if (this.userForm.valid) {
      if (this.data) {
        const userId = this.data.id;
        const formData = new FormData();
        if (this.newPic) {
          formData.append("avatar", this.avatarToSend);
        }
        if (this.removeCurrentAvatarStatus) {
          formData.append("avatar", null);
        }
        // formData.append('name', this.userForm.value.name);
        //  formData.append('email', this.userForm.value.email);
        formData.append("role", this.userForm.value.role);
        formData.append("email", this.userForm.value.email);
        //  formData.append('registration_number', this.userForm.value.registration_number);
        formData.append("name", this.userForm.value.name);
        //  formData.append('first_name', this.userForm.value.first_name);
        formData.append("slug_id", this.userForm.value.slug_id);
        // formData.append('function', this.userForm.value.function);
        // formData.append('status', this.userForm.value.status);
        this.userService.updateUser(formData, userId).subscribe(
          (res) => {
            this.notifications.create(
              "Succès",
              "Mettre à jour un utilisateur avec succès",
              NotificationType.Success,
              { theClass: "primary", timeOut: 6000, showProgressBar: true }
            );
            this.modalRef.hide();
            this.clearAll();

            localStorage.setItem("avatar", JSON.stringify(res.avatar.url));
            this.ourNotificationService.notficateReloadUsers();
          },
          (error) => {
            this.notifications.create(
              "Error",
              "error",
              NotificationType.Error,
              { theClass: "primary", timeOut: 6000, showProgressBar: true }
            );
          }
        );
      } else {
        const formData = new FormData();
        formData.append("avatar", this.avatarToSend);
        formData.append("name", this.userForm.value.name);
        formData.append("email", this.userForm.value.email);
        //  formData.append('first_name', this.userForm.value.first_name);
        // formData.append('function', this.userForm.value.function);
        formData.append("password", this.userForm.value.password);
        formData.append("role", this.userForm.value.role);
        //  formData.append('registration_number', this.userForm.value.registration_number);
        //  formData.append('status', this.userForm.value.status);
        formData.append("slug_id", this.userForm.value.slug_id);
        this.userService.addUser(formData).subscribe(
          (res) => {
            this.notifications.create(
              "Succès",
              "Créer un utilisateur avec succès",
              NotificationType.Success,
              { theClass: "primary", timeOut: 6000, showProgressBar: true }
            );
            this.modalRef.hide();
            this.clearAll();
            localStorage.setItem(
              "avatar",
              JSON.stringify(res.body.data.avatar.url)
            );
            this.ourNotificationService.notficateReloadUsers();
          },
          (error) => {
            this.notifications.create(
              "Error",
              "error",
              NotificationType.Error,
              { theClass: "primary", timeOut: 6000, showProgressBar: true }
            );
          }
        );
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
      };
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
    this.avatarName = null;
    // delete file from images List
    this.avatarToSend = null;

    this.AvatarToDisplay = null;
  }

  hideModel() {
    this.modalRef.hide();
    this.newPic = false;
    this.avatarName = null;
    this.avatarToSend = null;
    this.AvatarToDisplay = null;
  }

  removeCurrentAvatar() {
    this.removeCurrentAvatarStatus = true;

    this.avatarName = null;

    this.avatarToSend = null;

    this.AvatarToDisplay = null;
  }

  clearAll() {
    this.newPic = false;
    this.avatarName = null;
    this.avatarToSend = null;
    this.AvatarToDisplay = null;
    this.removeCurrentAvatarStatus = false;
  }

  customSearchP(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.Name.toLocaleLowerCase().indexOf(term) > -1;
  }

  getAllSlugs() {
    this.slugsService.getSlugs(1, "created_at", "desc", 999999, "").subscribe(
      (data) => {
        if (data.status) {
          const resp = data.body;
          this.allSlugs = resp.data;
        }
      },
      (error) => {
        this.notifications.create("Error", "error", NotificationType.Error, {
          theClass: "primary",
          timeOut: 6000,
          showProgressBar: false,
        });
      }
    );
  }
}
