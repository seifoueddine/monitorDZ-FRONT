import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { Articles } from 'src/app/shared/models/articles.model';
import { MediaService } from 'src/app/shared/services/media.service';
import { Media } from 'src/app/shared/models/media.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
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

  totalElements: any;

 
  itemOrder = 'Title';
  itemOptionsOrders = ['Title', 'Category', 'Status', 'Label'];
  displayOptionsCollapsed = false;

  surveyItems: any[] = [];
  description = ""
  mediaNameSelected: any;
  // @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewSurveyModalComponent;

  constructor(private renderer: Renderer2, private articleService: ArticlesService, private notifications: NotificationsService,
    private ourNotificationService: OurNotificationsService, private mediaService: MediaService, private router: Router) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'right-menu');
    this.setPage({ offset: 0 });
     this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
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
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
    });
  }

  pageChanged(event: any): void {
    console.log(event);
    this.currentPage = event.page
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
  }
  

  loadData(pageSize, currentPage, direction, orderBy, search) {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.search = search;
    this.orderBy = orderBy;
    this.direction = direction

    this.articleService.getArticles(currentPage, orderBy , direction, pageSize, search).subscribe(
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
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
    this.loading = false;
  }, 1000);
}

onSelect({ selected }) {
  console.log(selected);
  
  this.idItem = ''
  const array = [];
  selected.map(x=> { array.push( x.id) });
  this.idItem =  array.join(',');
  console.log(this.idItem);
  
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
        
          this.loadData(12, 1, 'desc', 'created_at', '');
          this.spinnerCrawling = false;
        }
      },
      error => {
        this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      }
    );
  }

  goToDetailsNewPage(article_id) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['app/articles/details'], { queryParams: { id: article_id } })
    );
    window.open(url, "_blank");
  }


}
