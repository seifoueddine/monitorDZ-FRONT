import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Lightbox } from 'ngx-lightbox';
import { Articles } from 'src/app/shared/models/articles.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details-article',
  templateUrl: './details-article.component.html',
  styleUrls: ['./details-article.component.scss']
})
export class DetailsArticleComponent implements OnInit {
  valueBind: string;
  articleId: any;
  article: any;
  detailImages: any;
  owner: any;
  defaultImage = "assets/img/no-image-article.png"
  //defaultImage = "https://review.content-science.com/wp-content/uploads/2015/09/CSR_article_hero_Complex-Transformation-of-Moving-from-Print-to-Digital-Content-ECRIs-Story.png"
  urlForImage = environment.URL_PATH;
  configTimeModal = {
    ignoreBackdropClick: true
  };
  article_status: boolean = false;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  tags: any;
  mediaName: string;
  authorName: string;
  modalRef: any;
  body: any;
  similar: any;
  constructor(private route: ActivatedRoute, private articlesService: ArticlesService,  private router: Router,private modalService: BsModalService,
    private modal: BsModalService, private notifications: NotificationsService, private lightbox: Lightbox) {


      this.route
      .queryParams
      .subscribe(params => {
        this.articleId = params['id'];

        this.articlesService.getArticleById(this.articleId)
          .subscribe((res: any) => {
            console.log(res);
            this.article = res.article.data;
            this.tags = this.article.attributes.media_tags ?  this.article.attributes.media_tags.split(',') : [];
            this.mediaName = res.article.included[1].attributes.name;
            this.authorName = res.article.included[0].attributes.name;
            this.similar = res.similar.data;
            this.similar = this.similar.filter(a=>a.id !== this.article.id);
            this.getBodyWithTags();
          }, error => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          });
      }, error => {
        // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
      });


     }

     openModal(template: TemplateRef<any>, data: any) {
      this.valueBind = data.attributes.body;
      this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
    }

  ngOnInit(): void {
 
  }

  openLightbox(src: string): void {
    this.lightbox.open([{ src, thumb: '' }], 0, { centerVertically: true, positionFromTop: 0, disableScrolling: true, wrapAround: true });
  }


  goToLink(link) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([link])
    );
    window.open(url, "_blank");
  }

  decline(): void {

  
    this.modalRef.hide();
  }

  submit(): void {
    const object = new Articles;
    object.id = this.articleId;
    object.body = this.valueBind;
  
    this.articlesService.updateArticle(object).subscribe(resCreate => {
      this.article.attributes.body = resCreate.data.attributes.body;
     
      this.notifications.create('Success', "Mettre à jour l'article avec succès", NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      this.modalRef.hide();
    
     
    }, err => {
      
      this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

    });
   
    this.modalRef.hide();
  }


  getBodyWithTags(){
    this.tags = this.tags.filter(function(e){return e}); 
    this.tags.map(t => {
      let tag = t.trim();
      let re = new RegExp(tag, 'g');
      this.article.attributes.body = this.article.attributes.body.replace(re, '<span style="padding-right: 2px; padding-left: 2px; border-radius: 5px; border: 1px solid #73b0ff; background-color:#95bff5;";font-weight:bold">' + tag + '</span>');
    }) 

  }


  getBodyWithSearch(body){
    const firstBody = body
  
     return ((firstBody.slice(0, 100) + ' ...'))
  

  }

}
