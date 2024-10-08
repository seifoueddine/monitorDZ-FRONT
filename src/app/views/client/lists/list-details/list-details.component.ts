import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListsService } from 'src/app/shared/services/lists.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Lightbox } from 'ngx-lightbox';
import { Lists } from 'src/app/shared/models/lists.model';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent implements OnInit {
  listId: any;
  list: any;
  detailImages: any;
  owner: any;
  defaultImage = "assets/img/no-image-article.png";
  defaultIcon = "assets/img/logo.jpg";
  urlForImage = environment.URL_PATH;
  articles: any;
  public options = {
    position: ["bottom", "center"],
}
  constructor(private route: ActivatedRoute, private listsService: ListsService,  private router: Router,private modalService: BsModalService,
    private modal: BsModalService, private notifications: NotificationsService, private lightbox: Lightbox, private sanitizer: DomSanitizer) {


      this.route
      .queryParams
      .subscribe(params => {
        this.listId = params['id'];

        this.listsService.getListById(this.listId)
          .subscribe((res: any) => {
            this.list = res.lists.data;
            this.articles = res.articles.data;
   
          }, error => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          });
      }, error => {
        // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
      });



     }

  ngOnInit(): void {
  }

  
deleteArticle(article_id){
  if (article_id) {
    const object = new Lists;
    object.id = this.listId
    object.delete_article_id = article_id;
    this.listsService.updateList(object).subscribe(resCreate => {

      this.notifications.create('Success', "Supprimer l'articles avec succès", NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      this.listsService.getListById(this.listId)
          .subscribe((res: any) => {
            this.list = res.lists.data;
            this.articles = res.articles.data;
          }, error => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          });

    }, err => {

        this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

    });
  }



}

getBodyWithSearch(body) {
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
  body = body.slice(0, 100);
  return this.sanitizer.bypassSecurityTrustHtml('<div style="font-size: 15px !important;">'+ body +'</div>'); 
}
  

}
