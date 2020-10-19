import { Component, OnInit, ViewChild, EventEmitter, Output, Input, TemplateRef } from '@angular/core';
import { NotificationType, NotificationsService } from 'angular2-notifications';
import { SectorsService } from 'src/app/shared/services/sectors.service';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { SlugsService } from 'src/app/shared/services/slugs.service';
import { MediaService } from 'src/app/shared/services/media.service';
import { CampaignsService } from 'src/app/shared/services/campaigns.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TagsService } from 'src/app/shared/services/tags.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { ListsService } from 'src/app/shared/services/lists.service';

@Component({
  selector: 'app-list-page-header',
  templateUrl: './list-page-header.component.html',
  styleUrls: ['./list-page-header.component.scss']
})
export class ListPageHeaderComponent implements OnInit {
  displayOptionsCollapsed = false;

  @Input() showOrderBy = true;
  @Input() showSearch = true;
  @Input() showItemsPerPage = true;
  @Input() showDisplayMode = true;
  @Input() displayMode = 'list';
  @Input() totalElements = 0;
  @Input() selectAllState = '';
  @Input() itemsPerPage = 10;
  @Input() itemOptionsPerPage = [5, 10, 20];
  @Input() itemOrder = { label: 'Product Name', value: 'title' };
  @Input()  itemOptionsOrders = [{ label: 'Product Name', value: 'title' }, { label: 'Category', value: 'category' }, { label: 'Status', value: 'status' }];
  @Input() media
  @Output() changeDisplayMode: EventEmitter<string> = new EventEmitter<string>();
  @Output() addNewItem: EventEmitter<any> = new EventEmitter();
  @Output() selectAllChange: EventEmitter<any> = new EventEmitter();
  @Output() searchKeyUp: EventEmitter<any> = new EventEmitter();
  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();
  @Output() changeOrderBy: EventEmitter<any> = new EventEmitter();
  @Output() selectMedium: EventEmitter<any> = new EventEmitter();
  @ViewChild('search') search: any;
  modalRef: any;
  constructor( 
    private modalService: BsModalService,
    private sectorsService: SectorsService,
    private slugsService: SlugsService,
    private mediaService: MediaService,
    private campaignService: CampaignsService,
    private ourNotificationService: OurNotificationsService,
    private notifications: NotificationsService,
    private  translateService: TranslateService,
    private tagsService: TagsService,
    private usersService: UsersService,
    private listsService: ListsService) { }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  ngOnInit() {
  }

  @Input() id = "";
  @Input() currentPage = "";

  onSelectDisplayMode(mode: string) {
    this.changeDisplayMode.emit(mode);
  }
  onAddNewItem() {
    this.addNewItem.emit(null);
  }
  selectAll(event) {
    this.selectAllChange.emit(event);
  }
  onChangeItemsPerPage(item) {
    this.itemsPerPageChange.emit(item);
  }

  onChangeOrderBy(item) {
    this.itemOrder = item;
    this.changeOrderBy.emit(item);
  }

  selectMedia(item) {
   // this.itemOrder = item;
    this.selectMedium.emit(item);
  }

  onSearchKeyUp($event){
    this.searchKeyUp.emit($event);
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.name.toLocaleLowerCase().indexOf(term) > -1
  }

  deleteItem(currentPage, id) {
    console.log("page: " + currentPage);
    console.log("id: " + id);
    switch (currentPage) {
      case "sectors":
        this.deleteSector(id);
        break;
        case "slugs":
        this.deleteSlug(id);
        break;
        case "media":
        this.deleteMedia(id);
        break;
        case "campaigns":
          this.deleteCampaign(id);
          break;
          case "tags":
            this.deleteTag(id);
            break;
            case "users":
            this.deleteUsers(id);
            break;
            case "lists":
              this.deleteLists(id);
              break;
      default:
        break;
    }
    this.modalRef.hide();
  }

  deleteSector(id) {
    this.sectorsService.deleteSector(id).subscribe(
      (res) => {
        this.notifications.create(
          "Succès",
          "Supprimer le secteur avec succès",
          NotificationType.Success,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
        this.ourNotificationService.notficateReloadSectors();
        this.id = "";
        // this.selectAllState = '';
      },
      (err) => {
        this.notifications.create(
          "Warn", this.translateService.instant('errors.' +  err.error.code)
         ,
          NotificationType.Warn,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
      }
    );
  }


  deleteSlug(id) {
    this.slugsService.deleteSlug(id).subscribe(
      (res) => {
        this.notifications.create(
          "Succès",
          "Supprimer l'entreprise avec succès",
          NotificationType.Success,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
        this.ourNotificationService.notficateReloadSlugs();
        this.id = "";
        // this.selectAllState = '';
      },
      (err) => {
        this.notifications.create(
          "Warn",
          err.error.message,
          NotificationType.Warn,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
      }
    );
  }

   deleteMedia(id) {
    this.mediaService.deleteMedia(id).subscribe(
      (res) => {
        this.notifications.create(
          "Succès",
          "Supprimer média avec succès",
          NotificationType.Success,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
        this.ourNotificationService.notficateReloadMedia();
        this.id = "";
        // this.selectAllState = '';
      },
      (err) => {
        this.notifications.create(
          "Warn",
          this.translateService.instant('errors.' +  err.error.code),
          NotificationType.Warn,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
      }
    );
  }

  deleteCampaign(id) {
    this.campaignService.deleteCampaign(id).subscribe(
      (res) => {
        this.notifications.create(
          "Succès",
          "Supprimer campagne avec succès",
          NotificationType.Success,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
        this.ourNotificationService.notficateReloadCampaigns();
        this.id = "";
        // this.selectAllState = '';
      },
      (err) => {
        this.notifications.create(
          "Warn",
          this.translateService.instant('errors.' +  err.error.code),
          NotificationType.Warn,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
      }
    );
  }

  deleteTag(id) {
    this.tagsService.deleteTag(id).subscribe(
      (res) => {
        this.notifications.create(
          "Succès",
          "Supprimer tag avec succès",
          NotificationType.Success,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
        this.ourNotificationService.notficateReloadTags();
        this.id = "";
        // this.selectAllState = '';
      },
      (err) => {
        this.notifications.create(
          "Warn",
          this.translateService.instant('errors.' +  err.error.code),
          NotificationType.Warn,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
      }
    );
  }



  deleteUsers(id) {
    this.usersService.deleteUser(id).subscribe(
      (res) => {
        this.notifications.create(
          "Succès",
          "Supprimer utilisateur avec succès",
          NotificationType.Success,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
        this.ourNotificationService.notficateReloadUsers();
        this.id = "";
        // this.selectAllState = '';
      },
      (err) => {
        this.notifications.create(
          "Warn",
          this.translateService.instant('errors.' +  err.error.code),
          NotificationType.Warn,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
      }
    );
  }


  
  deleteLists(id) {
    this.listsService.deleteList(id).subscribe(
      (res) => {
        this.notifications.create(
          "Succès",
          "Supprimer list avec succès",
          NotificationType.Success,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
        this.ourNotificationService.notficateReloadLists();
        this.id = "";
        // this.selectAllState = '';
      },
      (err) => {
        this.notifications.create(
          "Warn",
          this.translateService.instant('errors.' +  err.error.code),
          NotificationType.Warn,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
      }
    );
  }

  decline(): void {
  
    this.modalRef.hide();
  }

}
