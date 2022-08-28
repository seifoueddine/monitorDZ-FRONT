import { Component, OnInit, Renderer2, TemplateRef } from "@angular/core";
import { NotificationType, NotificationsService } from "angular2-notifications";
import { ArticlesService } from "src/app/shared/services/articles.service";
import { MediaService } from "src/app/shared/services/media.service";
import { Router } from "@angular/router";
import { OurNotificationsService } from "src/app/shared/our-notifications.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { Articles } from "src/app/shared/models/articles.model";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { AuthorsService } from "src/app/shared/services/authors.service";
import { ListsService } from 'src/app/shared/services/lists.service';
import { Lists } from 'src/app/shared/models/lists.model';
import { DomSanitizer } from '@angular/platform-browser';
import saveAs from 'file-saver';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-client-articles",
  templateUrl: "./client-articles.component.html",
  styleUrls: ["./client-articles.component.scss"],
})
export class ClientArticlesComponent implements OnInit {
  modalRefEmail: any;
  start_date: any = new Date();
  end_date: any = new Date();
  duration: any;
  urlForImage = environment.URL_PATH;
  displayMode = "image";
  [x: string]: any;
  today: Date = new Date();
  defaultImage = "assets/img/no-image-article.png";
  defaultIcon = "assets/img/logo.jpg";
  rows: any;
  lanIds: any;
  public options = {
    position: ["bottom", "center"],
  };
  spinner: boolean = true;
  ColumnMode = ColumnMode;
  // temp = [...this.rows];
  itemsPerPage: number = 12;
  itemOptionsPerPage = [6, 12, 24];
  selected = [];
  SelectionType = SelectionType;
  selectAllState = "";
  idItem: any = "";
  media: any;
  spinnerCrawling = false;
  totalItem = 0;
  totalPage = 0;
  currentPage: number = 1;
  search: string = "";
  orderBy: string = "created_at";
  direction: string = "desc";
  loading: boolean;
  page: any;
  searchReq: any;
  buttonState = "";
  totalElements: any;
  mediaIds: any;
  authorIds: any;
  articlesPending: any;
  lists: any;
  email = "";
  itemOrder = { label: this.translateService.instant('header.title' ), value: "title" };
  itemOptionsOrders = [
    { label: this.translateService.instant('header.title' ), value: "title" }, 
    { label: this.translateService.instant('header.status' ), value: "status" },
    { label: this.translateService.instant('header.author' ), value: "author_id" },
  ];
  displayOptionsCollapsed = false;
  maxDate = new Date();
  authors: any;
  rage_date: any = [new Date(), new Date()];
 // rage_date: any = [];
  surveyItems: any[] = [];
  description = "";
  mediaNameSelected: any;
  valueBind: string;
  articleDetails: any;
  mediaTypesSelected = [];
  zoneSelected = [];
  languages = [
    { value: "fr", viewValue: "Fr" },
    { value: "ar", viewValue: "Ar" },
    { value: "en", viewValue: "En" },
  ];
  langIdJoin: any;
  tags: any;

  // @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewSurveyModalComponent;

  constructor(
    private renderer: Renderer2,
    private articleService: ArticlesService,
    private notifications: NotificationsService,
    private ourNotificationService: OurNotificationsService,
    private authorsService: AuthorsService,
    private router: Router,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private listsService: ListsService,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
  ) {
    // this.end_date = new Date(this.maxDate.setMonth(this.maxDate.getMonth() + 1));
  }

  openModal(template: TemplateRef<any>, data: any) {
    this.valueBind = data.attributes.body;
    this.articleId = data.id;
    this.modalRef = this.modalService.show(template, { class: "modal-xl" });
  }

  openDetailsModal(template: TemplateRef<any>, data: any) {
    this.articleDetails = data;
    this.getBodyWithTags();
    //  this.articleId = data.id;
    this.modalRef = this.modalService.show(template, { class: "modal-xl" });
  }

  getBodyWithTags() {
    // this.tags = this.tags.filter(function(e){return e});
    const tags = this.articleDetails.attributes.tags.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );
    tags.map((t) => {
      let tag = t.name.trim();
      let re = new RegExp(tag, "g");
      this.articleDetails.attributes.body = this.articleDetails.attributes.body.replace(
        re,
        '<span style="padding-right: 2px; padding-left: 2px; border-radius: 5px; border: 1px solid #73b0ff; background-color:#95bff5;";font-weight:bold">' +
          tag +
          "</span>"
      );
    });
  }

  ngOnInit() {
    this.renderer.addClass(document.body, "right-menu");
    this.setPage({ offset: 0 });
    this.loadData(
      this.itemsPerPage,
      this.currentPage,
      this.direction,
      this.orderBy,
      this.search,
      this.media_ids,
      this.start_date,
      this.end_date,
      this.authorsIdJoin,
      this.langJoin,
      this.tagsNameJoin,
      this.mediaTypesJoin,
      this.zoneJoin
    );
    this.listenToNotifier();
    this.getAuthors();
    this.getLists();
  }

  
  getLists(){
    this.listsService.getLists(1, 'created_at' , 'desc', 9999, '').subscribe(
      data => {
        if (data.status) {
 
          const resp = data.body;
          this.lists = resp.data;
        }
      },
      error => {
        this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      }
    );
  }

  getAuthors() {
    this.authorsService.getAuthorsClients().subscribe(
      (data) => {
        if (data.status) {
          const resp = data.body;
          this.authors = resp.data;
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

  ngOnDestroy() {
    this.renderer.removeClass(document.body, "right-menu");
  }

  listenToNotifier() {
    this.ourNotificationService.reloadArticlesNotifier$.subscribe((res) => {
      this.selected = [];
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.media_ids,
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    });
  }

  pageChanged(event: any): void {
      
    this.currentPage = event.page;
    this.loadData(
      this.itemsPerPage,
      this.currentPage,
      this.direction,
      this.orderBy,
      this.search,
      this.media_ids,
      this.start_date,
      this.end_date,
      this.authorsIdJoin,
      this.langJoin,
      this.tagsNameJoin,
      this.mediaTypesJoin,
      this.zoneJoin
    );
  }

  itemsPerPageChange(item) {
    this.itemsPerPage = item;
    this.loadData(
      this.itemsPerPage,
      this.currentPage,
      this.direction,
      this.orderBy,
      this.search,
      this.media_ids,
      this.start_date,
      this.end_date,
      this.authorsIdJoin,
      this.langJoin,
      this.tagsNameJoin,
      this.mediaTypesJoin,
      this.zoneJoin
    );
  }

  loadData(
    pageSize,
    currentPage,
    direction,
    orderBy,
    search,
    media_ids,
    start_date,
    end_date,
    authorId,
    langValues,
    tagsName,
    mediaTypesJoin,
    zoneJoin
  ) {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.search = search;
    this.orderBy = orderBy;
    this.direction = direction;
    this.media_ids = media_ids;
    this.articleService
      .getClientArticles(
        currentPage,
        orderBy,
        direction,
        pageSize,
        search,
        media_ids,
        start_date,
        end_date,
        authorId,
        langValues,
        tagsName,
        mediaTypesJoin,
        zoneJoin
      )
      .subscribe(
        (data) => {
          if (data.status) {
            this.totalElements = +data.headers.get("X-Total-Count");
            const resp = data.body;
            this.rows = resp.articles.data;
            this.rows.map((x) => {
              x.attributes.tags = x.attributes.tags.filter(
                (v, i, a) => a.findIndex((t) => t.id === v.id) === i
              );
            });
            //  this.articlesArchived = resp.data.stats.archived;
            //  this.articlesPending = resp.pending;
            this.media = resp.media.data;
            this.tags = resp.tags;
            this.totalItem = data.totalItem;
            this.totalPage = data.totalPage;
            this.spinner = false;
          }
        },
        (error) => {
          this.spinner = false;
          this.notifications.create("Error", "error", NotificationType.Error, {
            theClass: "primary",
            timeOut: 6000,
            showProgressBar: false,
          });
        }
      );
  }

  changeOrderBy(item: any) {
    this.orderBy = item.value;
    this.loadData(
      this.itemsPerPage,
      this.currentPage,
      this.direction,
      this.orderBy,
      this.search,
      this.media_ids,
      this.start_date,
      this.end_date,
      this.authorsIdJoin,
      this.langJoin,
      this.tagsNameJoin,
      this.mediaTypesJoin,
      this.zoneJoin
    );
  }

  showAddNewModal() {
    // this.addNewModalRef.show();
  }

  editArticle(article) {
    // this.addNewModalRef.show(article);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase().trim();
      
    this.search = val;
    if (this.searchReq) {
      clearTimeout(this.searchReq);
    }
    this.searchReq = setTimeout(() => {
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.media_ids,
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
      this.loading = false;
    }, 1000);
  }

  onSelect(item: any) {
    this.idItem = "";
    const array = [];
    if (this.isSelected(item)) {
      this.selected = this.selected.filter((x) => x.id !== item.id);
      this.selected.map((x) => {
        array.push(x.id);
      });
      this.idItem = array.join(",");
       
    } else {
      this.selected.push(item);
      this.selected.map((x) => {
        array.push(x.id);
      });
      this.idItem = array.join(",");
       
    }

    // selected.map(x=> { array.push( x.id) });
    // this.idItem =  array.join(',');
    //  

    // this.selected.splice(0, this.selected.length);
    // this.selected.push(...selected);
    this.setSelectAllState();
  }

  setSelectAllState() {
    if (this.selected.length === this.rows.length) {
      this.selectAllState = "checked";
    } else if (this.selected.length !== 0) {
      this.selectAllState = "indeterminate";
    } else {
      this.selectAllState = "";
    }
  }

  selectAllChange($event) {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    this.idItem = "";
    const array = [];
    this.selected.map((x) => {
      array.push(x.id);
    });
    this.idItem = array.join(",");
     
    this.setSelectAllState();
  }

  onItemsPerPageChange(itemCount) {
    this.itemsPerPage = itemCount;
    this.currentPage = 1;
    this.loadData(
      this.itemsPerPage,
      this.currentPage,
      this.direction,
      this.orderBy,
      this.search,
      this.media_ids,
      this.start_date,
      this.end_date,
      this.authorsIdJoin,
      this.langJoin,
      this.tagsNameJoin,
      this.mediaTypesJoin,
      this.zoneJoin
    );
    // this.loading = false;
  }

  onSort(event) {
    // event was triggered, start sort sequence
    this.loading = true;
    const sortValue = event.sorts[0].prop;
    const dirValue = event.sorts[0].dir;
    this.direction = dirValue;
    this.orderBy = sortValue;
    // emulate a server request with a timeout
    setTimeout(() => {
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.media_ids,
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
      this.loading = false;
    }, 1000);
  }

  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  setPage(pageInfo) {
    this.currentPage = pageInfo.offset + 1;
    this.loadData(
      this.itemsPerPage,
      this.currentPage,
      this.direction,
      this.orderBy,
      this.search,
      this.media_ids,
      this.start_date,
      this.end_date,
      this.authorsIdJoin,
      this.langJoin,
      this.tagsNameJoin,
      this.mediaTypesJoin,
      this.zoneJoin
    );
      
      
  }

  isSelected(p: any) {
    return this.selected.findIndex((x) => x.id === p.id) > -1;
  }

  selectAll($event) {
    if ($event.target.checked) {
      this.selected = [...this.surveyItems];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  displayArticle(body) {
    let bodyArticle = body;
    bodyArticle = bodyArticle.replace(/<div .*<\/div>/, "");
    bodyArticle = bodyArticle.replace("/t", "");
    bodyArticle = bodyArticle.replace("/n", "");
    return bodyArticle;
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
      this.router.createUrlTree(["admin/articles/details"], {
        queryParams: { id: article_id },
      })
    );
    window.open(url, "_blank");
  }

  selectMedia(event) {
      

    this.spinner = true;
    let media = event;

    this.mediaIds = [];
    const mediasArray = event;
    mediasArray.map((s) => this.mediaIds.push(s.id));

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
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
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
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    }
  }

  selectAuthor(event) {
    this.spinner = true;

    this.authorIds = [];
    const authorsArray = event;
    authorsArray.map((s) => this.authorIds.push(s.id));

    if (this.authorIds.length > 0) {
      this.authorsIdJoin = this.authorIds.join(",");
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaIdJoin,
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
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
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    }
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  changeDisplayMode(mode) {
    this.displayMode = mode;
  }

  decline(): void {
    this.modalRef.hide();
  }

  submit(): void {
    const object = new Articles();
    object.id = this.articleId;
    object.body = this.valueBind;

    this.articleService.updateArticle(object).subscribe(
      (resCreate) => {
        const article = resCreate.data;
        let index = this.rows.findIndex((x) => x.id === article.id);

        if (index !== -1) {
          this.rows[index] = article;
        }
        // this.rows.map(article => arr2.find(o => o.id === article.id) || article);
        this.notifications.create(
          "Success",
          "Mettre à jour l'article avec succès",
          NotificationType.Success,
          { theClass: "primary", timeOut: 6000, showProgressBar: false }
        );
        this.modalRef.hide();
      },
      (err) => {
        this.notifications.create("Erreur", "error", NotificationType.Error, {
          theClass: "primary",
          timeOut: 6000,
          showProgressBar: false,
        });
      }
    );

    this.modalRef.hide();
  }

  getBodyWithSearch(body) {
    const firstBody = body;
   
    body = body.replace('<strong>', "<p>"); 
    body = body.replace('</strong>', "</p>"); 

    body = body.replace('<h1', "<p"); 
    body = body.replace('</h1>', "</p>"); 

    body = body.replace('</h2>', "</p>"); 
    body = body.replace('<h2', "<p"); 

    body = body.replace('<h3', "<p"); 
    body = body.replace('</h3>', "</p>"); 


    body = body.replace('<h4', "<p"); 
    body = body.replace('</h4>', "</p>"); 

    body = body.replace('<h5', "<p"); 
    body = body.replace('</h5>', "</p>"); 


    body = body.replace('<h6', "<p"); 
    body = body.replace('</h6>', "</p>"); 

    body = body.replace('<b>', ""); 
    body = body.replace('</b>', ""); 


    body = body.slice(0, 150);
    return this.sanitizer.bypassSecurityTrustHtml('<div style="font-size: 15px !important;">'+ body +'</div>'); 
  }

  removeDates() {
    this.spinner = true;
    this.start_date = new Date();
    this.end_date = new Date();
    this.duration = null;
    this.rage_date = [new Date(),new Date()];
    this.loadData(
      this.itemsPerPage,
      1,
      this.direction,
      this.order_by,
      this.search,
      this.media_ids,
      this.start_date,
      this.end_date,
      this.authorsIdJoin,
      this.langJoin,
      this.tagsNameJoin,
      this.mediaTypesJoin,
      this.zoneJoin
    );
  }

  changeDate(rangeDate: any) {
    this.spinner = true;
    this.start_date = this.datePipe.transform(
      new Date(rangeDate[0]),
      "dd/MM/yyyy"
    );
    this.end_date = this.datePipe.transform(
      new Date(rangeDate[1]),
      "dd/MM/yyyy"
    );

    let d2 = Date.parse(rangeDate[0]);
    let d1 = Date.parse(rangeDate[1]);
    this.loadData(
      this.itemsPerPage,
      1,
      this.direction,
      this.order_by,
      this.search,
      this.media_ids,
      this.start_date,
      this.end_date,
      this.authorsIdJoin,
      this.langJoin,
      this.tagsNameJoin,
      this.mediaTypesJoin,
      this.zoneJoin
    );

    let m = moment(d1);
    let years = m.diff(d2, "years");
    m.add(-years, "years");
    let months = m.diff(d2, "months");
    m.add(-months, "months");
    let days = m.diff(d2, "days");

    this.duration =
      +years > 0
        ? years + " Years " + months + " Mois " + days + " Jours "
        : +months > 0
        ? months + " Mois " + (+days > 0 ? days + " jours " : "")
        : days > 0
        ? days + " Jours "
        : "Même Jour";
  }

  selectLang(lan) {
    this.spinner = true;
    this.lanIds = [];
    const langArray = lan;
    langArray.map((s) => this.lanIds.push(s.value));

    if (this.lanIds.length > 0) {
      this.langJoin = this.lanIds.join(",");
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaIdJoin,
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
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
        this.start_date,
        this.end_date,
        this.authorIds,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    }
  }

  selectTag(tag) {
    this.spinner = true;
    this.tagsName = [];
    const langArray = tag;
    langArray.map((s) => this.tagsName.push(s.name));

    if (this.tagsName.length > 0) {
      this.tagsNameJoin = this.tagsName.join(",");
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaIdJoin,
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    } else {
      this.tagsNameJoin = null;
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaId,
        this.start_date,
        this.end_date,
        this.authorIds,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    }
  }

  changeStatusNum(event) {

     this.spinner = true;
    if (event.target.checked) {
      this.mediaTypesSelected.push("digital");
    } else {
      const index = this.mediaTypesSelected.indexOf("digital", 0);
      if (index > -1) {
        this.mediaTypesSelected.splice(index, 1);
      }
    }


    if (this.mediaTypesSelected.length > 0) {
      this.mediaTypesJoin = this.mediaTypesSelected.join(",");
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaIdJoin,
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    } else {
      this.mediaTypesJoin = null;
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaId,
        this.start_date,
        this.end_date,
        this.authorIds,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    }



  }
  changeStatusPaper(event) {
    this.spinner = true;
    if (event.target.checked) {
      this.mediaTypesSelected.push("paper");
   
    } else {
      const index = this.mediaTypesSelected.indexOf("paper", 0);
      if (index > -1) {
        this.mediaTypesSelected.splice(index, 1);
      }
  
    }

    if (this.mediaTypesSelected.length > 0) {
      this.mediaTypesJoin = this.mediaTypesSelected.join(",");
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaIdJoin,
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    } else {
      this.mediaTypesJoin = null;
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaId,
        this.start_date,
        this.end_date,
        this.authorIds,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    }
  }

  changeStatusNatio(event) {
    this.spinner = true;
    if (event.target.checked) {
      this.zoneSelected.push("national");
    } else {
      const index = this.zoneSelected.indexOf("national", 0);
      if (index > -1) {
        this.zoneSelected.splice(index, 1);
      }
    }
    

    if (this.zoneSelected.length > 0) {
      this.zoneJoin = this.zoneSelected.join(",");
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaIdJoin,
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    } else {
      this.zoneJoin = null;
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaId,
        this.start_date,
        this.end_date,
        this.authorIds,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    }






  }
  changeStatusInernatio(event) {
    this.spinner = true;
    if (event.target.checked) {
      this.zoneSelected.push("international");
    } else {
      const index = this.zoneSelected.indexOf("international", 0);
      if (index > -1) {
        this.zoneSelected.splice(index, 1);
      }
    }
    

    if (this.zoneSelected.length > 0) {
      this.zoneJoin = this.zoneSelected.join(",");
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaIdJoin,
        this.start_date,
        this.end_date,
        this.authorsIdJoin,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    } else {
      this.zoneJoin = null;
      this.loadData(
        this.itemsPerPage,
        this.currentPage,
        this.direction,
        this.orderBy,
        this.search,
        this.mediaId,
        this.start_date,
        this.end_date,
        this.authorIds,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin
      );
    }

  }
  openModalLists(templateLists: TemplateRef<any>) {
    this.modalRefLists = this.modalService.show(templateLists, { class: 'modal-sm' });
  }
  selectList(event){
    this.list = event.id;
   }

   declineList(): void {
  
    this.modalRefLists.hide();
  }

  AddArticles(){


    if (this.idItem) {
      const object = new Lists;
      object.id = this.list
      object.article_id = this.idItem;
      this.listsService.updateList(object).subscribe(resCreate => {

        this.notifications.create('Success', 'Ajouter les articles avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
        this.modalRefLists.hide();
        this.idItem = '';
        
        this.selected = []
      //  this.ourNotificationService.notficateReloadTags();
  
      }, err => {
 
          this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

      });
    }

  }


  openModalEmail(templateEmail: TemplateRef<any>, articleId: any) {
    this.articleId = articleId;
    this.modalRefEmail = this.modalService.show(templateEmail, { class: 'modal-sm' });
  }
  

  exportPDF(articleId) { 
    this.buttonState = 'show-spinner';
    this.articleService.exportPDF(articleId).subscribe(res => {
      const blob = new Blob([res.body], { type: 'application/pdf' });
      saveAs.saveAs(blob);
   
    }, err => {
    
      // this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
    });
  }


  SendMail() { 
    if (this.email != '') {
      this.articleService.sendEmail(this.articleId, this.email).subscribe(res => {
        this.modalRefEmail.hide();
        this.notifications.create('Success', 'Envoie email avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

      }, err => {
        this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      });
    } else {
      this.notifications.create('', 'Merci de Mettre email du destinataire', NotificationType.Warn, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
    }
   
  }

  declineEmail(): void {

  
    this.modalRefEmail.hide();
  }


}
