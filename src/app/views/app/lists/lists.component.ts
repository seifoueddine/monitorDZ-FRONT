import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent, ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';

import { environment } from 'src/environments/environment';
import { ListsService } from 'src/app/shared/services/lists.service';
import { carouselData, ICarouselItem } from 'src/app/data/carousels';
import { ListFormComponent } from './list-form/list-form.component';
import { Lists } from 'src/app/shared/models/lists.model';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  urlForImage = environment.URL_PATH; 
  defaultIcon = "assets/img/logo.jpg"
  public options = {
    position: ["bottom", "center"],
}
  spinner: boolean = true;
  ColumnMode = ColumnMode;
  temp = [...this.rows];
  itemsPerPage: number = 12;
  itemOptionsPerPage = [5, 10, 20];
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  idItem: any ='';
 
  
  totalItem = 0;
  totalPage = 0;
  currentPage: number = 1;
  search: string = '';
  orderBy: string = 'created_at';
  direction: string = 'desc'
  loading: boolean;
  page: any;
  searchReq: any;

  totalElements: any;
  carouselItems: ICarouselItem[] = carouselData;
  setting1 = {
    gap: 0,
    type: 'carousel',
    perView: 1,
    breakpoints: { '600': { perView: 1 }, '1000': { perView: 2 } }
  };
  setting2 = {
    gap: 0,
    type: 'carousel',
    perView: 2,
    breakpoints: { '600': { perView: 1 }, '1000': { perView: 2 } }
  };
setting3 = {
  gap: 0,
  type: 'carousel',
  perView: 3,
  breakpoints: { '600': { perView: 1 }, '1000': { perView: 2 } }
}
  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: ListFormComponent; 
  showModal: any;
  defaultImage = "assets/img/no-image-article.png"

  constructor(private listsService: ListsService, private notifications: NotificationsService,
    private ourNotificationService: OurNotificationsService,private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.setPage({ offset: 0 });
    // this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
     this.listenToNotifier();
  
 
  }


  
  listenToNotifier() {
    this.ourNotificationService.reloadListNotifier$.subscribe(res => {
    this.selected = [];
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
    });
  }


  

  loadData(pageSize, currentPage, direction, orderBy, search) {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.search = search;
    this.orderBy = orderBy;
    this.direction = direction

    this.listsService.getLists(currentPage, orderBy , direction, pageSize, search).subscribe(
      data => {
        if (data.status) {
          this.totalElements = +data.headers.get('X-Total-Count');
          const resp = data.body;
          this.rows = resp.data
          this.totalItem = data.totalItem;
          this.totalPage = data.totalPage;
          this.spinner = false;
        }
      },
      error => {
        this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      }
    );
  }


  
  showAddNewModal() {
     this.addNewModalRef.show(); 
  } 


  editList(list){

  this.addNewModalRef.show(list);
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

//  onSelect({ selected }) {
//    console.log(selected);
   
//    this.idItem = ''
//    const array = [];
//    selected.map(x=> { array.push( x.id) });
//    this.idItem =  array.join(',');
//    console.log(this.idItem);
   
//    this.selected.splice(0, this.selected.length);
//    this.selected.push(...selected);
//    this.setSelectAllState();
//  }

 setSelectAllState() {
   if (this.selected.length === this.rows.length) {
     this.selectAllState = 'checked';
   } else if (this.selected.length !== 0) {
     this.selectAllState = 'indeterminate';
   } else {
     this.selectAllState = '';
   }
 }

 selectAllChange($event) {
   if ($event.target.checked) {
     this.selected = [...this.rows];
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

 onItemsPerPageChange(itemCount) {
   console.log(itemCount);
   this.itemsPerPage = itemCount;
   this.currentPage = 1
   this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
   // this.loading = false;
  
 }


 onSort(event) {
   // event was triggered, start sort sequence
   console.log('Sort Event', event);
   this.loading = true;
   const sortValue = event.sorts[0].prop
   const dirValue = event.sorts[0].dir
   this.direction = dirValue
   this.orderBy = sortValue;
   // emulate a server request with a timeout
   setTimeout(() => {
     this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
     this.loading = false;
   }, 1000);
 }



  /**
  * Populate the table with new data based on the page number
  * @param page The page to select
  */
 setPage(pageInfo) {
   this.currentPage = pageInfo.offset + 1;
   this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
   console.log(pageInfo);
   console.log(this.currentPage);
 }


 isSelected(p: any) {
  return this.selected.findIndex(x => x.id === p.id) > -1;
}

onSelect(item: any) {
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

deleteArticle(article_id, list_id){
  console.log(article_id);
  console.log(list_id);

  if (article_id) {
    const object = new Lists;
    object.id = list_id
    object.delete_article_id = article_id;
    this.listsService.updateList(object).subscribe(resCreate => {

      this.notifications.create('Success', "Supprimer l'articles avec succès", NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      // this.modalRef.hide();
      // this.idItem = '';
      this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
      // this.selected = []
    //  this.ourNotificationService.notficateReloadTags();

    }, err => {

        this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

    });
  }



}


}
