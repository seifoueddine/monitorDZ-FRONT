import { Component, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SelectionType } from "@swimlane/ngx-datatable";
import { NotificationsService, NotificationType } from "angular2-notifications";
import { BsModalService } from "ngx-bootstrap/modal";
import { Lists } from "src/app/shared/models/lists.model";
import { ListsService } from "src/app/shared/services/lists.service";
import { SearchService } from "src/app/shared/services/search.service";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { AuthorsService } from "src/app/shared/services/authors.service";
@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  today: Date = new Date();
  start_date: any;
  end_date: any;
  duration: any;
  modalRef: any;
  result: any;
  searchKey: string;
  orderBy: string = "created_at";
  direction: string = "desc";
  itemsPerPage: number = 12;
  currentPage: number = 1;
  totalElements: any;
  time: any;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = "";
  idItem: any = "";
  list: any;
  lists: any;
  suggestions: any[];
  authors: any;
  rage_date: any = [];
  authorsIdJoin: any;
  authorIds = [];
  mediaIds = [];
  zoneSelected = [];
  mediaTypesSelected = [];
  mediaTypesJoin: any;
  zoneJoin: any;
  lanIds = [];
  langJoin: any;
  tagsNameJoin: any;
  tagsName = [];
  media = [];
  tags: any;
  mediaIdJoin: any;
  languages = [
    { value: "fr", viewValue: "Fr" },
    { value: "ar", viewValue: "Ar" },
    { value: "en", viewValue: "En" },
  ];
  public options = {
    position: ["bottom", "center"],
  };
  urlForImage = environment.URL_PATH;
  defaultIcon = "assets/img/logo.jpg";
  spinner = false;
  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private listsService: ListsService,
    private notifications: NotificationsService,
    private router: Router,
    private datePipe: DatePipe,
    private authorsService: AuthorsService
  ) {
    this.route.queryParams.subscribe(
      (params) => {
        this.searchKey = params["key"];
        this.spinner = true;
        this.result = [];
        this.searchService
          .search(
            this.currentPage,
            this.orderBy,
            this.direction,
            this.itemsPerPage,
            this.searchKey,
            this.authorsIdJoin,
            this.start_date,
            this.end_date,
            this.langJoin,
            this.tagsNameJoin,
            this.mediaTypesJoin,
            this.zoneJoin,
            this.mediaIdJoin
          )
          .subscribe(
            (res: any) => {
              this.totalElements = +res.headers.get("X-Total-Count");
              this.result = res.body.result_articles.data;
              this.spinner = false;
              this.suggestions = res.body.suggestions;
              this.tags = res.body.tags;
              this.media = res.body.media.data;
              this.time = res.body.time;
              this.spinner = false;
            },
            (error) => {
              // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
            }
          );
      },
      (error) => {
        // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
      }
    );
  }

  ngOnInit(): void {
    this.getLists();
    this.getAuthors();
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

  getLists() {
    this.listsService.getLists(1, "created_at", "desc", 9999, "").subscribe(
      (data) => {
        if (data.status) {
          const resp = data.body;
          this.lists = resp.data;
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

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.searchService
      .search(
        this.currentPage,
        this.orderBy,
        this.direction,
        this.itemsPerPage,
        this.searchKey,
        this.authorsIdJoin,
        this.start_date,
        this.end_date,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin,
        this.mediaIdJoin
      )
      .subscribe(
        (res: any) => {
          this.totalElements = +res.headers.get("X-Total-Count");
          this.result = res.body.result_articles.data;
          this.time = res.body.time;
          this.spinner = false;
        },
        (error) => {
          // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
        }
      );
  }

  getBodyWithSearch(body) {
    // Helper function to replace tags
    const replaceTags = (input) => {
      const tagMap = {
        '<strong>': '<p>',
        '</strong>': '</p>',
        '<h1': '<p',
        '</h1>': '</p>',
        '<h2': '<p',
        '</h2>': '</p>',
        '<h3': '<p',
        '</h3>': '</p>',
        '<h4': '<p',
        '</h4>': '</p>',
        '<h5': '<p',
        '</h5>': '</p>',
        '<h6': '<p',
        '</h6>': '</p>',
        '<b>': '',
        '</b>': ''
      };
  
      return Object.keys(tagMap).reduce(
        (acc, tag) => acc.replaceAll(tag, tagMap[tag]),
        input
      );
    };
  
    // Sanitize the body
    let sanitizedBody = replaceTags(body);
    let firstBody = replaceTags(body);
  
    // Search logic
    let index = sanitizedBody.toLowerCase().indexOf(this.searchKey.toLowerCase());
    if (index === -1) {
      return firstBody.slice(0, 150) + " ...";
    }
  
    // Extract context around the search key
    const contextStart = Math.max(0, index - 75);
    const contextEnd = Math.min(sanitizedBody.length, index + 75);
    let highlightedBody = sanitizedBody.slice(contextStart, contextEnd);
  
    // Highlight the search key
    highlightedBody = highlightedBody.replace(
      new RegExp(this.searchKey, 'gi'),
      (match) => `<b><font color="#FB6400">${match}</font></b>`
    );
  
    return `... ${highlightedBody} ...`;
  }
  

  getAuthorWithSearch(author) {
    const firstBody = author;

    let index = author.toLowerCase().indexOf(this.searchKey);

    // author = author.toLowerCase().replace(this.searchKey, '<b><font  color="#FB6400">' + this.searchKey + '</font></b>');
    return index == -1 ? false : true;
    // })
  }

  isSelected(p: any) {
    return this.selected.findIndex((x) => x.id === p.id) > -1;
  }

  onSelect(item: any) {
    if (this.isSelected(item)) {
      this.selected = this.selected.filter((x) => x.id !== item.id);
    } else {
      this.selected.push(item);
    }
    this.idItem = "";
    const array = [];
    this.selected.map((x) => {
      array.push(x.id);
    });
    this.idItem = array.join(",");

    this.setSelectAllState();
  }

  private setSelectAllState() {
    const { length: selectedCount } = this.selected;
    const { length: resultCount } = this.result;
  
    if (selectedCount === resultCount && selectedCount > 0) {
      this.selectAllState = "checked";
    } else if (selectedCount > 0) {
      this.selectAllState = "indeterminate";
    } else {
      this.selectAllState = "";
    }
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  customSearchMedia(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  selectList(event) {
    this.list = event.id;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  decline(): void {
    this.modalRef.hide();
  }

  AddArticles() {
    if (this.idItem) {
      const object = new Lists();
      object.id = this.list;
      object.article_id = this.idItem;
      this.listsService.updateList(object).subscribe(
        (resCreate) => {
          this.notifications.create(
            "Success",
            "Ajouter les articles avec succès",
            NotificationType.Success,
            { theClass: "primary", timeOut: 6000, showProgressBar: false }
          );
          this.modalRef.hide();
          this.idItem = "";

          this.selected = [];
          //  this.ourNotificationService.notficateReloadTags();
        },
        (err) => {
          this.notifications.create("Erreur", "error", NotificationType.Error, {
            theClass: "outline primary",
            timeOut: 6000,
            showProgressBar: false,
          });
        }
      );
    }
  }

  makeSearch(key) {
    this.router.navigate(["/admin/search"], {
      queryParams: { key: key.toLowerCase().trim() },
    });
    this.searchKey = "";
  }

  changeDate(rangeDate: any[]) {
    this.spinner = true;
  
    // Update date range
    this.updateDateRange(rangeDate);
  
    // Calculate duration
    this.calculateDuration(rangeDate);
  
    // Perform search
    this.performSearch();
  }
  
  private updateDateRange(rangeDate: any[]) {
    this.start_date = this.datePipe.transform(
      new Date(rangeDate[0]),
      "dd/MM/yyyy"
    );
    this.end_date = this.datePipe.transform(
      new Date(rangeDate[1]),
      "dd/MM/yyyy"
    );
  }
  
  private calculateDuration(rangeDate: any[]) {
    const startDate = Date.parse(rangeDate[0]);
    const endDate = Date.parse(rangeDate[1]);
  
    const m = moment(endDate);
    const years = m.diff(startDate, "years");
    m.add(-years, "years");
    const months = m.diff(startDate, "months");
    m.add(-months, "months");
    const days = m.diff(startDate, "days");
  
    this.duration =
      years > 0
        ? `${years} Years ${months} Months ${days} Days`
        : months > 0
        ? `${months} Months ${days > 0 ? days + " Days" : ""}`
        : days > 0
        ? `${days} Days`
        : "Same Day";
  }

  removeDates() {
    this.spinner = true;
    this.start_date = null;
    this.end_date = null;
    this.duration = null;
    this.rage_date = [];

    this.searchService
      .search(
        this.currentPage,
        this.orderBy,
        this.direction,
        this.itemsPerPage,
        this.searchKey,
        this.authorsIdJoin,
        this.start_date,
        this.end_date,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin,
        this.mediaIdJoin
      )
      .subscribe(
        (res: any) => {
          this.totalElements = +res.headers.get("X-Total-Count");
          this.result = res.body.result_articles.data;
          this.suggestions = res.body.suggestions;
          this.tags = res.body.tags;
          this.media = res.body.media;
          this.time = res.body.time;
          this.spinner = false;
        },
        (error) => {
          // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
        }
      );
  }

  selectAuthor(event) {
    this.spinner = true;

    this.authorIds = [];
    const authorsArray = event;
    authorsArray.map((s) => this.authorIds.push(s.id));

    if (this.authorIds.length > 0) {
      this.authorsIdJoin = this.authorIds.join(",");
      this.searchService
        .search(
          this.currentPage,
          this.orderBy,
          this.direction,
          this.itemsPerPage,
          this.searchKey,
          this.authorsIdJoin,
          this.start_date,
          this.end_date,
          this.langJoin,
          this.tagsNameJoin,
          this.mediaTypesJoin,
          this.zoneJoin,
          this.mediaIdJoin
        )
        .subscribe(
          (res: any) => {
            this.totalElements = +res.headers.get("X-Total-Count");
            this.result = res.body.result_articles.data;
            this.suggestions = res.body.suggestions;
            this.spinner = false;
            this.tags = res.body.tags;
            this.media = res.body.media;
            this.time = res.body.time;
            this.spinner = false;
          },
          (error) => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
        );
    } else {
      this.authorsIdJoin = null;
      this.searchService
        .search(
          this.currentPage,
          this.orderBy,
          this.direction,
          this.itemsPerPage,
          this.searchKey,
          this.authorsIdJoin,
          this.start_date,
          this.end_date,
          this.langJoin,
          this.tagsNameJoin,
          this.mediaTypesJoin,
          this.zoneJoin,
          this.mediaIdJoin
        )
        .subscribe(
          (res: any) => {
            this.totalElements = +res.headers.get("X-Total-Count");
            this.result = res.body.result_articles.data;
            this.suggestions = res.body.suggestions;
            this.tags = res.body.tags;
            this.media = res.body.media;
            this.time = res.body.time;
            this.spinner = false;
          },
          (error) => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
        );
    }
  }

  selectMedia(event: any[]) {
    this.spinner = true;
  
    // Update media selection
    this.updateMediaSelection(event);
  
    // Perform search
    this.performSearch();
  }
  
  private updateMediaSelection(mediaArray: any[]) {
    this.mediaIds = mediaArray.map((s) => s.id);
    this.mediaIdJoin = this.mediaIds.length > 0 ? this.mediaIds.join(",") : null;
  }
  

  changeStatusNum(event) {
    //   this.spinner = true;
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
      this.searchService
        .search(
          this.currentPage,
          this.orderBy,
          this.direction,
          this.itemsPerPage,
          this.searchKey,
          this.authorsIdJoin,
          this.start_date,
          this.end_date,
          this.langJoin,
          this.tagsNameJoin,
          this.mediaTypesJoin,
          this.zoneJoin,
          this.mediaIdJoin
        )
        .subscribe(
          (res: any) => {
            this.totalElements = +res.headers.get("X-Total-Count");
            this.result = res.body.result_articles.data;
            this.suggestions = res.body.suggestions;
            this.tags = res.body.tags;
            this.media = res.body.media;
            this.time = res.body.time;
            this.spinner = false;
          },
          (error) => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
        );
    } else {
      this.mediaTypesJoin = null;
      this.searchService
        .search(
          this.currentPage,
          this.orderBy,
          this.direction,
          this.itemsPerPage,
          this.searchKey,
          this.authorsIdJoin,
          this.start_date,
          this.end_date,
          this.langJoin,
          this.tagsNameJoin,
          this.mediaTypesJoin,
          this.zoneJoin,
          this.mediaIdJoin
        )
        .subscribe(
          (res: any) => {
            this.totalElements = +res.headers.get("X-Total-Count");
            this.result = res.body.result_articles.data;
            this.suggestions = res.body.suggestions;
            this.tags = res.body.tags;
            this.media = res.body.media;
            this.time = res.body.time;
            this.spinner = false;
          },
          (error) => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
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
      this.searchService
        .search(
          this.currentPage,
          this.orderBy,
          this.direction,
          this.itemsPerPage,
          this.searchKey,
          this.authorsIdJoin,
          this.start_date,
          this.end_date,
          this.langJoin,
          this.tagsNameJoin,
          this.mediaTypesJoin,
          this.zoneJoin,
          this.mediaIdJoin
        )
        .subscribe(
          (res: any) => {
            this.totalElements = +res.headers.get("X-Total-Count");
            this.result = res.body.result_articles.data;
            this.suggestions = res.body.suggestions;
            this.tags = res.body.tags;
            this.media = res.body.media;
            this.time = res.body.time;
            this.spinner = false;
          },
          (error) => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
        );
    } else {
      this.mediaTypesJoin = null;
      this.searchService
        .search(
          this.currentPage,
          this.orderBy,
          this.direction,
          this.itemsPerPage,
          this.searchKey,
          this.authorsIdJoin,
          this.start_date,
          this.end_date,
          this.langJoin,
          this.tagsNameJoin,
          this.mediaTypesJoin,
          this.zoneJoin,
          this.mediaIdJoin
        )
        .subscribe(
          (res: any) => {
            this.totalElements = +res.headers.get("X-Total-Count");
            this.result = res.body.result_articles.data;
            this.suggestions = res.body.suggestions;
            this.tags = res.body.tags;
            this.media = res.body.media;
            this.time = res.body.time;
            this.spinner = false;
          },
          (error) => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
        );
    }
  }

  changeStatusNatio(event) {
    // this.spinner = true;
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
      this.searchService
        .search(
          this.currentPage,
          this.orderBy,
          this.direction,
          this.itemsPerPage,
          this.searchKey,
          this.authorsIdJoin,
          this.start_date,
          this.end_date,
          this.langJoin,
          this.tagsNameJoin,
          this.mediaTypesJoin,
          this.zoneJoin,
          this.mediaIdJoin
        )
        .subscribe(
          (res: any) => {
            this.totalElements = +res.headers.get("X-Total-Count");
            this.result = res.body.result_articles.data;
            this.suggestions = res.body.suggestions;
            this.tags = res.body.tags;
            this.media = res.body.media;
            this.time = res.body.time;
            this.spinner = false;
          },
          (error) => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
        );
    } else {
      this.zoneJoin = null;
      this.searchService
        .search(
          this.currentPage,
          this.orderBy,
          this.direction,
          this.itemsPerPage,
          this.searchKey,
          this.authorsIdJoin,
          this.start_date,
          this.end_date,
          this.langJoin,
          this.tagsNameJoin,
          this.mediaTypesJoin,
          this.zoneJoin,
          this.mediaIdJoin
        )
        .subscribe(
          (res: any) => {
            this.totalElements = +res.headers.get("X-Total-Count");
            this.result = res.body.result_articles.data;
            this.suggestions = res.body.suggestions;
            this.tags = res.body.tags;
            this.media = res.body.media;
            this.time = res.body.time;
            this.spinner = false;
          },
          (error) => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
        );
    }
  }
  changeStatusInernatio(event: any) {
    this.spinner = true;
  
    // Update zone selection
    this.updateZoneSelection(event.target.checked, "international");
  
    // Perform search
    this.performSearch();
  }
  
  private updateZoneSelection(isChecked: boolean, zone: string) {
    if (isChecked) {
      if (!this.zoneSelected.includes(zone)) {
        this.zoneSelected.push(zone);
      }
    } else {
      const index = this.zoneSelected.indexOf(zone);
      if (index > -1) {
        this.zoneSelected.splice(index, 1);
      }
    }
  
    this.zoneJoin = this.zoneSelected.length > 0 ? this.zoneSelected.join(",") : null;
  }
  


  selectLang(lan: any[]) {
    this.spinner = true;
    // Extract language IDs
    this.lanIds = lan.map((s) => s.value);
    this.langJoin = this.lanIds.length > 0 ? this.lanIds.join(",") : null;
  
    // Perform search
    this.performSearch();
  }
  
  private performSearch() {
    this.searchService
      .search(
        this.currentPage,
        this.orderBy,
        this.direction,
        this.itemsPerPage,
        this.searchKey,
        this.authorsIdJoin,
        this.start_date,
        this.end_date,
        this.langJoin,
        this.tagsNameJoin,
        this.mediaTypesJoin,
        this.zoneJoin,
        this.mediaIdJoin
      )
      .subscribe(
        (res: any) => {
          this.handleSearchSuccess(res);
        },
        (error) => {
          this.handleSearchError(error);
        }
      );
  }
  
  private handleSearchSuccess(res: any) {
    this.totalElements = +res.headers.get("X-Total-Count");
    this.result = res.body.result_articles.data;
    this.suggestions = res.body.suggestions;
    this.tags = res.body.tags;
    this.media = res.body.media;
    this.time = res.body.time;
    this.spinner = false;
  }
  
  private handleSearchError(error: any) {
    console.error("Search error:", error);
    // Uncomment the line below to display the error in the UI
    // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
    this.spinner = false;
  }
  

  selectTag(tag) {
    this.spinner = true;
    this.tagsName = [];
    const langArray = tag;
    langArray.map((s) => this.tagsName.push(s.name));

    if (this.tagsName.length > 0) {
      this.tagsNameJoin = this.tagsName.join(",");
      this.searchService
        .search(
          this.currentPage,
          this.orderBy,
          this.direction,
          this.itemsPerPage,
          this.searchKey,
          this.authorsIdJoin,
          this.start_date,
          this.end_date,
          this.langJoin,
          this.tagsNameJoin,
          this.mediaTypesJoin,
          this.zoneJoin,
          this.mediaIdJoin
        )
        .subscribe(
          (res: any) => {
            this.totalElements = +res.headers.get("X-Total-Count");
            this.result = res.body.result_articles.data;
            this.suggestions = res.body.suggestions;
            this.tags = res.body.tags;
            this.media = res.body.media;
            this.time = res.body.time;
            this.spinner = false;
          },
          (error) => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
        );
    } else {
      this.tagsNameJoin = null;

      this.searchService
        .search(
          this.currentPage,
          this.orderBy,
          this.direction,
          this.itemsPerPage,
          this.searchKey,
          this.authorsIdJoin,
          this.start_date,
          this.end_date,
          this.langJoin,
          this.tagsNameJoin,
          this.mediaTypesJoin,
          this.zoneJoin,
          this.mediaIdJoin
        )
        .subscribe(
          (res: any) => {
            this.totalElements = +res.headers.get("X-Total-Count");
            this.result = res.body.result_articles.data;
            this.suggestions = res.body.suggestions;
            this.tags = res.body.tags;
            this.media = res.body.media;
            this.time = res.body.time;
            this.spinner = false;
          },
          (error) => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
        );
    }
  }
}
