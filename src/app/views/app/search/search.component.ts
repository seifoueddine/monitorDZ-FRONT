import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  result: any;
  searchKey: string;
  orderBy: string = 'created_at';
  direction: string = 'desc';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalElements: any;
  time: any;
  constructor(private route: ActivatedRoute, private searchService: SearchService) {


    
    this.route
    .queryParams
    .subscribe(params => {
      this.searchKey = params['key'];

      this.searchService.search(this.currentPage, this.orderBy, this.direction, this.itemsPerPage, this.searchKey)
        .subscribe((res: any) => {
          this.totalElements = +res.headers.get('X-Total-Count');
          this.result = res.body.result_articles.data;
          this.time = res.body.time;
        }, error => {
          // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
        });
    }, error => {
      // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
    });


   }

  ngOnInit(): void {
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

}
