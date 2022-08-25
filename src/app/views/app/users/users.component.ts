import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { Users } from 'src/app/shared/models/users.model';
import { UserFormComponent } from './user-form/user-form.component';
import { UntypedFormGroup, Validators, UntypedFormControl, ValidatorFn } from '@angular/forms';
import { NotificationType, NotificationsService } from 'angular2-notifications';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

const checkPasswords: ValidatorFn = (fg: UntypedFormGroup) => {
  const pass = fg.get('password').value;
  const confirmPass = fg.get('password_confirmation').value;

  return pass === confirmPass ? null : { notSame: true } 
}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  staticPic = "assets/img/avatar.png";
  displayMode = 'thumb';
  selectAllState = '';
  selected: Users[] = [];
  data: any[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  search = '';
  orderBy = 'created_at';
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  totalPage = 0;
  direction: string = 'desc';
  urlForImage = environment.URL_PATH; 
  totalElements: number;
  optionsOrders = [{ label: 'Créé à', value: 'created_at' }, { label: 'Role', value: 'role' }];
  itemOrder = { label: 'Créé à', value: 'created_at' };
  searchReq: any;
  idItem: any = '';
  loading: boolean;
  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: UserFormComponent;
  modalChangePasswordRef: BsModalRef;
  config = {
    animated: true
  };
  changePasswordForm: UntypedFormGroup;
  UserToChangePassword: any;
  public options = {
    position: ["bottom", "center"],
}
lastText = "<i class='simple-icon-control-end'></i>";
nextText = "<i class='simple-icon-arrow-right'></i>";
firstText = "<i class='simple-icon-control-start'></i>";
previousText = "<i class='simple-icon-arrow-left'></i>";
  slugs: any;
  constructor(private usersService: UsersService, private ourNotificationService: OurNotificationsService,
              private modalService: BsModalService, private notifications: NotificationsService) { }

  ngOnInit() {
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
    this.listenToNotifier();
  }


  listenToNotifier() {
    this.ourNotificationService.reloadUsersNotifier$.subscribe(res => {
  
      this.selected = [];
      this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
    })
  }


  loadData(pageSize, currentPage, direction, orderBy, search) {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.search = search;
    this.orderBy = orderBy;
 
    this.usersService.getUsers(currentPage, orderBy , direction, pageSize, search).subscribe(
      data => {
        if (data.status) {
          this.isLoading = false;
          this.totalElements = +data.headers.get('X-Total-Count');
          this.data = data.body.data;
          this.slugs = data.body.included;
         
          this.setSelectAllState();
        } else {
          this.endOfTheList = true;
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }
  

  
  showAddNewModal() {
    this.addNewModalRef.show();
  }


  editUser(user) {
    this.addNewModalRef.show(user);
  }

  


  updateFilter(event) {
    const val = event.target.value.toLowerCase().trim();
   console.log(val);
   this.search = val
   if (this.searchReq) {
     clearTimeout(this.searchReq);
   }
   this.searchReq =   setTimeout(() => {
     this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
     this.loading = false;
   }, 1000);
 }


isSelected(p: Users) {
  return this.selected.findIndex(x => x.id === p.id) > -1;
}
onSelect(item: Users) {
  if (this.isSelected(item)) {
    this.selected = this.selected.filter(x => x.id !== item.id);

  } else {
    this.selected.push(item);
  }
  this.idItem = ''
    const array = [];
    this.selected.map(x=> { array.push( x.id) });
    this.idItem =  array.join(',');
    console.log(this.idItem);
  this.setSelectAllState();
}

setSelectAllState() {
  if (this.selected.length === this.data.length) {
    this.selectAllState = 'checked';
  } else if (this.selected.length !== 0) {
    this.selectAllState = 'indeterminate';
  } else {
    this.selectAllState = '';
  }
}

selectAllChange($event) {
  if ($event.target.checked) {
    this.selected = [...this.data];
  } else {
    this.selected = [];
  }
  this.idItem = ''
    const array = [];
    this.selected.map(x => { array.push(x.id) });
    this.idItem = array.join(',');
    console.log(this.idItem);
  this.setSelectAllState();
}

pageChanged(event: any): void {
  console.log(event);
  this.currentPage = event.page;
  this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
}

itemsPerPageChange(perPage: number) {
  console.log(perPage);
  this.itemsPerPage = perPage;
  this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
}

changeOrderBy(item: any) {
  console.log(item);
  this.orderBy = item.value;
  this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
}

changeDirection(item: any) {
  console.log(item);
  this.direction = item.value;
  this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
}




searchKeyUp(event) {
  const val = event.target.value.toLowerCase().trim();
  this.search = val
    if (this.searchReq) {
      clearTimeout(this.searchReq);
    }
    this.searchReq =   setTimeout(() => {
      this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
    }, 1000);
}


onItemsPerPageChange(itemCount) {
  console.log(itemCount);
  this.itemsPerPage = itemCount;
  setTimeout(() => {
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
    this.loading = false;
  }, 1000);
}


openChangePasswordModal(template: TemplateRef<any>, user: any) {
  this.UserToChangePassword = user;
  this.modalChangePasswordRef = this.modalService.show(template, this.config);
  this.createChangePasswordForm();
}



createChangePasswordForm() {
    this.changePasswordForm = new UntypedFormGroup({
      password: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]),
      password_confirmation: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]),
    },checkPasswords);

}

changePassword(event) {
  // event.preventDefault();

  if (this.changePasswordForm.valid) {
      event.preventDefault();
      const object: any = {}
      object.id = this.UserToChangePassword.id;
      object.password = this.changePasswordForm.value.password;
      object.password_confirmation = this.changePasswordForm.value.password_confirmation;
      this.usersService.changePassword(object).subscribe(resCreate => {
        console.log(resCreate);
        this.notifications.create('Succès', 'Changer de mot de passe avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
        this.modalChangePasswordRef.hide();
        this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
      }, error => {
        if(error.error.slug){
          this.notifications.create('Erreur', "L'utilisateur doit être affecté à un parc!", NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

        }else {
          this.notifications.create('Erreur', error.error.slug, NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

        }

      });
     
    
  }
}


getSlug(id){
  let slug
  if(this.slugs.length  > 0){
     slug = this.slugs.filter(p => +p.id === id);
  }

  return slug[0]?.attributes.name;
}



}
