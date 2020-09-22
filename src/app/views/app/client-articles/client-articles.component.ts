import { Component, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { NotificationType, NotificationsService } from 'angular2-notifications';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { MediaService } from 'src/app/shared/services/media.service';
import { Router } from '@angular/router';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Articles } from 'src/app/shared/models/articles.model';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { AuthorsService } from 'src/app/shared/services/authors.service';
@Component({
  selector: 'app-client-articles',
  templateUrl: './client-articles.component.html',
  styleUrls: ['./client-articles.component.scss']
})
export class ClientArticlesComponent implements OnInit {
  start_date: any;
  end_date: any;
  duration: any;
  urlForImage = environment.URL_PATH; 
  displayMode = 'image';
  [x: string]: any;
  today: Date = new Date();
  defaultImage = "assets/img/no-image-article.png"
  defaultIcon = "assets/img/logo.jpg"
  rows: any;
  lanIds: any;
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
  authorIds: any;
  articlesPending: any;
  itemOrder = { label: 'Titre', value: 'title' };
  itemOptionsOrders = [{ label: 'Titre', value: 'title' }, { label: 'Status', value: 'status' }, { label: 'Auteur', value: 'author_id' }];
  displayOptionsCollapsed = false;
  maxDate = new Date();
  authors: any;
 // rage_date: any = [new Date(), new Date(this.maxDate.setMonth(this.maxDate.getMonth() + 1))];
  rage_date: any = [];
  surveyItems: any[] = [];
  description = ""
  mediaNameSelected: any;
  valueBind: string;
  articleDetails: any;
  languages = [
    {value: 'fr', viewValue: 'Fr'},
    {value: 'ar', viewValue: 'Ar'},
    {value: 'en', viewValue: 'En'},
  ];
  langIdJoin: any;
  tags: any;
  // @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewSurveyModalComponent;

  constructor(private renderer: Renderer2, private articleService: ArticlesService, private notifications: NotificationsService,
    private ourNotificationService: OurNotificationsService, private authorsService: AuthorsService, private router: Router,
    private modalService: BsModalService, private datePipe: DatePipe) {
     // this.end_date = new Date(this.maxDate.setMonth(this.maxDate.getMonth() + 1));
     
     }


    
  openModal(template: TemplateRef<any>, data: any) {
    this.valueBind = data.attributes.body;
    this.articleId = data.id;
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
  }

  openDetailsModal(template: TemplateRef<any>, data: any) {
    this.articleDetails = data;
    this.getBodyWithTags();
  //  this.articleId = data.id;
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
  }

  
  getBodyWithTags(){
   // this.tags = this.tags.filter(function(e){return e}); 
    this.articleDetails.attributes.tags.map(t => {
      let tag = t.name.trim();
      let re = new RegExp(tag, 'g');
      this.articleDetails.attributes.body = this.articleDetails.attributes.body.replace(re, '<span style="padding-right: 2px; padding-left: 2px; border-radius: 5px; border: 1px solid #73b0ff; background-color:#95bff5;";font-weight:bold">' + tag + '</span>');
    }) 

  }

  

  ngOnInit() {
    this.renderer.addClass(document.body, 'right-menu');
    this.setPage({ offset: 0 });
     this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids, this.start_date, this.end_date, this.authorsIdJoin,  this.langJoin);
     this.listenToNotifier(); 
     this.getAuthors();
  }


   getAuthors(){

    this.authorsService.getAuthors().subscribe(
      data => {
        if (data.status) {
          const resp = data.body;
          this.authors = resp.data
        }
      },
      error => {
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
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids, this.start_date, this.end_date, this.authorsIdJoin,  this.langJoin);
    });
  }

  pageChanged(event: any): void {
    console.log(event);
    this.currentPage = event.page
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids, this.start_date, this.end_date, this.authorsIdJoin,  this.langJoin);
  }

  itemsPerPageChange(item){
    this.itemsPerPage = item ;
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids, this.start_date, this.end_date, this.authorsIdJoin,  this.langJoin);
  }
  

  loadData(pageSize, currentPage, direction, orderBy, search, media_ids, start_date, end_date, authorId, langValues) {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.search = search;
    this.orderBy = orderBy;
    this.direction = direction;
    this.media_ids = media_ids;
    this.articleService.getClientArticles(currentPage, orderBy , direction, pageSize, search, media_ids, start_date, end_date, authorId, langValues).subscribe(
      data => {
        if (data.status) {
          this.totalElements = +data.headers.get('X-Total-Count');
          const resp = data.body;
          this.rows = resp.articles.data;
        //  this.articlesArchived = resp.data.stats.archived;
        //  this.articlesPending = resp.pending;
        this.media = resp.media.data;
        this.tags = resp.tags;
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

  changeOrderBy(item: any) {
    this.orderBy = item.value;
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids, this.start_date, this.end_date, this.authorsIdJoin,  this.langJoin);
  }

  


  showAddNewModal() {
    // this.addNewModalRef.show();
  }

  editArticle(article){
    // this.addNewModalRef.show(article);
 }



 
 updateFilter(event) {
   const val = event.target.value.toLowerCase().trim();
  console.log(val);
  this.search = val
  if (this.searchReq) {
    clearTimeout(this.searchReq);
  }
  this.searchReq =   setTimeout(() => {
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids, this.start_date, this.end_date, this.authorsIdJoin,  this.langJoin);
    this.loading = false;
  }, 1000);
}

onSelect( item: any ) {
  console.log(item);
  this.idItem = ''
  const array = [];
  if (this.isSelected(item)) {
    this.selected = this.selected.filter(x => x.id !== item.id);
    this.selected.map(x=> { array.push( x.id) });
      this.idItem =  array.join(',');
  console.log(this.idItem);
  } else {
    this.selected.push(item);
    this.selected.map(x=> { array.push( x.id) });
      this.idItem =  array.join(',');
  console.log(this.idItem);
  }
  
  // selected.map(x=> { array.push( x.id) });
  // this.idItem =  array.join(',');
  // console.log(this.idItem);
  
  // this.selected.splice(0, this.selected.length);
  // this.selected.push(...selected);
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
  console.log(this.idItem);
  this.setSelectAllState();
}

onItemsPerPageChange(itemCount) {
  console.log(itemCount);
  this.itemsPerPage = itemCount;
  this.currentPage = 1
  this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids, this.start_date, this.end_date, this.authorsIdJoin,  this.langJoin);
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
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids, this.start_date, this.end_date, this.authorsIdJoin,  this.langJoin);
    this.loading = false;
  }, 1000);
}



 /**
 * Populate the table with new data based on the page number
 * @param page The page to select
 */
setPage(pageInfo) {
  this.currentPage = pageInfo.offset + 1;
  this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search,this.media_ids, this.start_date, this.end_date, this.authorsIdJoin,  this.langJoin);
  console.log(pageInfo);
  console.log(this.currentPage);
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



  // getNewArticles(id, name){
  //   this.mediaNameSelected = name;
  //   this.spinnerCrawling = true;
  //   this.articleService.crawling(id).subscribe(
  //     data => {
  //       if (data.status) {
  //         this.itemsPerPage = 12;
  //         this.currentPage = 1;
  //         this.direction = 'desc';
  //         this.order_by = 'created_at';
  //         this.search = '';
  //         this.media_ids= null;
  //         this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.order_by, this.search,this.media_ids, this.start_date, this.end_date, this.authorsIdJoin,  this.langJoin);
  //         this.spinnerCrawling = false;
  //       }
  //     },
  //     error => {
  //       this.spinnerCrawling = false;
  //       this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
  //     }
  //   );
  // }

  goToDetailsNewPage(article_id) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['app/articles/details'], { queryParams: { id: article_id } })
    );
    window.open(url, "_blank");
  }


  selectMedia(event) {
    console.log(event);
    
    this.spinner = true;
    let media = event;


    this.mediaIds = [];
    const mediasArray = event;
    mediasArray.map(s=> this.mediaIds.push(s.id));
    console.log(this.mediaIds);


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
        this.mediaIdJoin,
       this.start_date, this.end_date, this.authorsIdJoin,
       this.langJoin
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
       this.mediaId,
        this.start_date, this.end_date, this.authorsIdJoin,
        this.langJoin
      );
    }
  }

  selectAuthor(event) {
   this.spinner = true;
  
    


    this.authorIds = [];
    const authorsArray = event;
    authorsArray.map(s=> this.authorIds.push(s.id));

    if (this.authorIds.length > 0) {
      this.authorsIdJoin = this.authorIds.join(",");
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaIdJoin,
       this.start_date, this.end_date,
       this.authorsIdJoin,  this.langJoin
      );
    } else {
    this.authorsIdJoin = null;
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
       this.mediaId,
        this.start_date, this.end_date,
        this.authorsIdJoin,  this.langJoin
      );
    }
  }



  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.name.toLocaleLowerCase().indexOf(term) > -1
  }


  changeDisplayMode(mode) {
    this.displayMode = mode;
  }


  decline(): void {

  
    this.modalRef.hide();
  }

  submit(): void {
    const object = new Articles;
    object.id = this.articleId;
    object.body = this.valueBind;
  
    this.articleService.updateArticle(object).subscribe(resCreate => {
      const article = resCreate.data;
      let index = this.rows.findIndex(x => x.id ===article.id)

if (index !== -1) {
  this.rows[index] = article;
} 
     // this.rows.map(article => arr2.find(o => o.id === article.id) || article);
      this.notifications.create('Success', "Mettre à jour l'article avec succès", NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      this.modalRef.hide();
    
     
    }, err => {
      
      this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

    });
   
    this.modalRef.hide();
  }


  getBodyWithSearch(body){
      const firstBody = body
      body = body.slice(0 , 150);
      return  body + '...'


  }

  removeDates(){
    this.spinner = true;
    this.start_date = null;
    this.end_date = null;
    this.duration = null;
    this.rage_date = [];
    this.loadData(this.itemsPerPage, 1, this.direction, this.order_by, this.search,this.media_ids, this.start_date, this.end_date,this.authorsIdJoin,  this.langJoin);
  }

  changeDate(rangeDate: any) {
    this.spinner = true;
    this.start_date = this.datePipe.transform(new Date(rangeDate[0]), 'dd/MM/yyyy');
    this.end_date = this.datePipe.transform(new Date(rangeDate[1]), 'dd/MM/yyyy');

    let d2 = Date.parse(rangeDate[0]);
    let d1 = Date.parse(rangeDate[1]);
    this.loadData(this.itemsPerPage, 1, this.direction, this.order_by, this.search,this.media_ids, this.start_date, this.end_date, this.authorsIdJoin,  this.langJoin);

    let m = moment(d1);
    let years = m.diff(d2, 'years');
    m.add(-years, 'years');
    let months = m.diff(d2, 'months');
    m.add(-months, 'months');
    let days = m.diff(d2, 'days');

    this.duration = (+years > 0) ? (years + ' Years '+ months + ' Mois ' + days + ' Jours ') : (+months > 0) ? ( months + ' Mois ' + ((+days > 0) ?( days + ' jours ') : '')) : (days > 0) ? (days + ' Jours ') : "Aujourd'hui"

  }


  selectLang(lan) {
    this.spinner = true;
    this.lanIds = [];
    const langArray = lan;
    langArray.map(s=> this.lanIds.push(s.value));

    if (this.lanIds.length > 0) {
      this.langJoin = this.lanIds.join(",");
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaIdJoin,
       this.start_date, this.end_date,
       this.authorsIdJoin,
       this.langJoin
      );
    } else {
      this.langJoin = null;
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
       this.mediaId,
        this.start_date, this.end_date,
        this.authorIds,
        this.langJoin
      );
    }
   
  }

  selectTag(tag){
 console.log(tag);
 
  }


}
