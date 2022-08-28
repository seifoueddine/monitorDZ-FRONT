import { Component, OnInit, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { Articles } from 'src/app/shared/models/articles.model';
import { MediaService } from 'src/app/shared/services/media.service';
import { Media } from 'src/app/shared/models/media.model';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  [x: string]: any;
  defaultImage = "https://review.content-science.com/wp-content/uploads/2015/09/CSR_article_hero_Complex-Transformation-of-Moving-from-Print-to-Digital-Content-ECRIs-Story.png"
  rows: any;

  public options = {
    position: ["bottom", "center"],
}
  spinner: boolean = true;
  ColumnMode = ColumnMode;
  // temp = [...this.rows];
  itemsPerPage: number = 12;
  itemOptionsPerPage = [6, 12, 24];
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  idItem: any ='';
  media: any;
  spinnerCrawling = false;
  totalItem = 0;
  totalPage = 0;
  currentPage: number = 1;
  search: string = '';
  orderBy: string = 'created_at';
  direction: string = 'desc'
  loading: boolean;
  page: any;
  searchReq: any;
  buttonState = '';
  totalElements: any;
  mediaIds: any;
  urlForImage = environment.URL_PATH;
  itemOrder = 'Title';
  itemOptionsOrders = ['Title', 'Category', 'Status', 'Label'];
  displayOptionsCollapsed = false;

  surveyItems: any[] = [];
  description = ""
  mediaNameSelected: any;
  valueBind: string;
  // @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewSurveyModalComponent;

  constructor(private renderer: Renderer2, private articleService: ArticlesService, private notifications: NotificationsService,
    private ourNotificationService: OurNotificationsService, private mediaService: MediaService, private router: Router,
    private modalService: BsModalService) { }


    
  openModal(template: TemplateRef<any>, data: any) {
    this.valueBind = data.attributes.body;
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
  }

  ngOnInit() {
    this.renderer.addClass(document.body, 'right-menu');
    this.setPage({ offset: 0 });
     this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids);
     this.listenToNotifier();
     this.getMedia();
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
        this.spinner = false;
        this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      }
    );


  }
  

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'right-menu');
  }

 
  listenToNotifier() {
    this.ourNotificationService.reloadArticlesNotifier$.subscribe(res => {
    this.selected = [];
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids);
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids);
  }

  getArticlePerPage(item){
    this.itemsPerPage = item ;
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids);
  }
  

  loadData(pageSize, currentPage, direction, orderBy, search, media_ids) {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.search = search;
    this.orderBy = orderBy;
    this.direction = direction;
    this.media_ids = media_ids;
    this.articleService.getArticles(currentPage, orderBy , direction, pageSize, search, media_ids).subscribe(
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
        this.spinner = false;
        this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
        
      }
    );
  }


  showAddNewModal() {
    // this.addNewModalRef.show();
  }

  editArticle(article){
    // this.addNewModalRef.show(article);
 }



 
 updateFilter(event) {
   const val = event.target.value.toLowerCase().trim();
  this.search = val
  if (this.searchReq) {
    clearTimeout(this.searchReq);
  }
  this.searchReq =   setTimeout(() => {
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids);
    this.loading = false;
  }, 1000);
}

onSelect({ selected }) {
  
  this.idItem = ''
  const array = [];
  selected.map(x=> { array.push( x.id) });
  this.idItem =  array.join(',');
  
  this.selected.splice(0, this.selected.length);
  this.selected.push(...selected);
  this.setSelectAllState();
}

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
  this.setSelectAllState();
}

onItemsPerPageChange(itemCount) {
  this.itemsPerPage = itemCount;
  this.currentPage = 1
  this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids);
  // this.loading = false;
 
}


onSort(event) {
  // event was triggered, start sort sequence
  this.loading = true;
  const sortValue = event.sorts[0].prop
  const dirValue = event.sorts[0].dir
  this.direction = dirValue
  this.orderBy = sortValue;
  // emulate a server request with a timeout
  setTimeout(() => {
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids);
    this.loading = false;
  }, 1000);
}



 /**
 * Populate the table with new data based on the page number
 * @param page The page to select
 */
setPage(pageInfo) {
  this.currentPage = pageInfo.offset + 1;
  this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids);
}

  isSelected(p: any) {
    return this.selected.findIndex(x => x.id === p.id) > -1;
  }


  selectAll($event) {
    if ($event.target.checked) {
      this.selected = [...this.surveyItems];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }


  displayArticle(body){
    let bodyArticle = body
    bodyArticle = bodyArticle.replace(/<div .*<\/div>/ , '');
    bodyArticle = bodyArticle.replace('/t' , '')
    bodyArticle = bodyArticle.replace('/n' , '')
    return bodyArticle 
  }



  getNewArticles(id, name){
    this.mediaNameSelected = name;
    this.spinnerCrawling = true;
    this.articleService.crawling(id).subscribe(
      data => {
        if (data.status) {
          this.itemsPerPage = 12;
          this.currentPage = 1;
          this.direction = 'desc';
          this.order_by = 'created_at';
          this.search = '';
          this.media_ids= null;
          this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.order_by, this.search,this.media_ids);
          this.spinnerCrawling = false;
        }
      },
      error => {
        this.spinnerCrawling = false;
        this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      }
    );
  }

  goToDetailsNewPage(article_id) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['admin/articles/details'], { queryParams: { id: article_id } })
    );
    window.open(url, "_blank");
  }


  selectMedia(event) {
      
    

    let media = event;


    this.mediaIds = [];
    const mediasArray = event;
    mediasArray.map(s=> this.mediaIds.push(s.id));

    if (this.mediaIds.length > 0) {
      this.mediaIdJoin = this.mediaIds.join(",");
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        // this.startDate,
        // this.endDate,
        this.mediaIdJoin
      );
    } else {
      this.mediaId = null;
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        // this.startDate,
        // this.endDate,
       this.mediaId
      );
    }
  }
  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.name.toLocaleLowerCase().indexOf(term) > -1
  }

  decline(): void {
  
    this.modalRef.hide();
  }

  submit(): void {
  
    this.modalRef.hide();
  }

  goToAutoTag(){
    this.buttonState = 'show-spinner';

    this.articleService.autoTag().subscribe(
      data => {
        if (data.status) {
          this.itemsPerPage = 12;
          this.currentPage = 1;
          this.direction = 'desc';
          this.order_by = 'created_at';
          this.search = '';
          this.media_ids= null;
          this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.order_by, this.search,this.media_ids);
          this.buttonState = '';
        }
      },
      error => {
        this.buttonState = '';
        this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      }
    );



  }


}
