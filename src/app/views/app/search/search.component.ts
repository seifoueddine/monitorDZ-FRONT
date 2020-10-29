import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionType } from '@swimlane/ngx-datatable';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Lists } from 'src/app/shared/models/lists.model';
import { ListsService } from 'src/app/shared/services/lists.service';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  modalRef: any;
  result: any;
  searchKey: string;
  orderBy: string = 'created_at';
  direction: string = 'desc';
  itemsPerPage: number = 12;
  currentPage: number = 1;
  totalElements: any;
  time: any;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  idItem: any ='';
  list: any;
  lists: any;
  suggestions: any[];
  public options = {
    position: ["bottom", "center"],
};
  constructor(private modalService: BsModalService,private route: ActivatedRoute, private searchService: SearchService, private listsService: ListsService, private notifications: NotificationsService, private router: Router) {


    
    this.route
    .queryParams
    .subscribe(params => {
      this.searchKey = params['key'];

      this.searchService.search(this.currentPage, this.orderBy, this.direction, this.itemsPerPage, this.searchKey)
        .subscribe((res: any) => {
          this.totalElements = +res.headers.get('X-Total-Count');
          this.result = res.body.result_articles.data;
          this.suggestions = res.body.suggestions;
          this.time = res.body.time;
        }, error => {
          // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
        });
    }, error => {
      // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
    });


   }

  ngOnInit(): void {
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

  
  pageChanged(event: any): void {
    console.log(event);
    this.currentPage = event.page
    this.searchService.search(this.currentPage, this.orderBy, this.direction, this.itemsPerPage, this.searchKey)
    .subscribe((res: any) => {
      this.totalElements = +res.headers.get('X-Total-Count');
      this.result = res.body.result_articles.data;
      this.time = res.body.time;
 
    }, error => {
      // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
    });
  }


  getBodyWithSearch(body){
    const firstBody = body
    // this.tags = this.tags.filter(function(e){return e}); 
    // this.tags.map(t => {
      // let tag = t.trim();
      // let re = new RegExp(tag, 'g');
      let index  = body.toLowerCase().indexOf(this.searchKey);
     // body = body.slice(index - 75 , index + 75);
     body = body.slice((index > 75) ?  (index - 75) : 0 , (( firstBody.length - index ) > 75 ) ? (index + 75 ): index );
      body = body.toLowerCase().replace(this.searchKey, '<b><font  color="#FB6400">' + this.searchKey + '</font></b>');
     return (index === -1 || body === "" )? (firstBody.slice(0, 150) + ' ...') : ('... ' + body + ' ...')
    // }) 

  }

  getAuthorWithSearch(author){
    const firstBody = author
   
      let index  = author.toLowerCase().indexOf(this.searchKey);
     
     
     // author = author.toLowerCase().replace(this.searchKey, '<b><font  color="#FB6400">' + this.searchKey + '</font></b>');
     return index == -1 ? false : true
    // }) 

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

  setSelectAllState() {
    if (this.selected.length === this.result.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.name.toLocaleLowerCase().indexOf(term) > -1
  }

  selectList(event){
   this.list = event.id;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  
  decline(): void {
  
    this.modalRef.hide();
  }

  AddArticles(){


    if (this.idItem) {
      const object = new Lists;
      object.id = this.list
      object.article_id = this.idItem;
      this.listsService.updateList(object).subscribe(resCreate => {

        this.notifications.create('Success', 'Ajouter les articles avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
        this.modalRef.hide();
        this.idItem = '';
        
        this.selected = []
      //  this.ourNotificationService.notficateReloadTags();
  
      }, err => {
 
          this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

      });
    }

  }


  makeSearch(key){
    this.router.navigate(['/app/search'], { queryParams: { key: key.toLowerCase().trim() } });
    this.searchKey = '';
  }

}
