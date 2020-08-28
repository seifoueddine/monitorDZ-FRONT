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
          this.result = res.body.result_articles;
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
      this.result = res.body;
 
    }, error => {
      // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
    });
  }

}
