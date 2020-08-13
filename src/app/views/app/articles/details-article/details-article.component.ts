import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService } from 'angular2-notifications';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-details-article',
  templateUrl: './details-article.component.html',
  styleUrls: ['./details-article.component.scss']
})
export class DetailsArticleComponent implements OnInit {
  articleId: any;
  article: any;
  detailImages: any;
  owner: any;
  defaultImage = "https://review.content-science.com/wp-content/uploads/2015/09/CSR_article_hero_Complex-Transformation-of-Moving-from-Print-to-Digital-Content-ECRIs-Story.png"

  configTimeModal = {
    ignoreBackdropClick: true
  };
  article_status: boolean = false;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  constructor(private route: ActivatedRoute, private articlesService: ArticlesService,
    private modal: BsModalService, private notifications: NotificationsService, private lightbox: Lightbox) {


      this.route
      .queryParams
      .subscribe(params => {
        this.articleId = params['id'];

        this.articlesService.getArticleById(this.articleId)
          .subscribe((res: any) => {
            console.log(res);
            this.article = res.data;
          
           
          }, error => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          });
      }, error => {
        // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
      });


     }

  ngOnInit(): void {
  }

  openLightbox(src: string): void {
    this.lightbox.open([{ src, thumb: '' }], 0, { centerVertically: true, positionFromTop: 0, disableScrolling: true, wrapAround: true });
  }

}
