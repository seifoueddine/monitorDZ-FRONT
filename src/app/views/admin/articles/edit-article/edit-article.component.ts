import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Articles } from 'src/app/shared/models/articles.model';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { AuthorsService } from 'src/app/shared/services/authors.service';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit {
  articleId: any;
  article: any;
  valueBind: any;
  articleForm: UntypedFormGroup;
  authors: any;
  mediumId: any;
  sectors = [];
  evaluations = ['positif','negatif','neutre'];
  constructor( private authorsService: AuthorsService, private route: ActivatedRoute, private articlesService: ArticlesService,  private router: Router,private notifications: NotificationsService, private datePipe: DatePipe, private sanitizer: DomSanitizer) {

    this.route
    .queryParams
    .subscribe(params => {
      this.articleId = params['id'];

      this.articlesService.getArticleById(this.articleId)
        .subscribe((res: any) => {
           this.article = res.article.data;
           this.mediumId = res.article.data.attributes.medium.id;
           this.valueBind = this.article.attributes.body;
           this.sectors = ['Personne Politique','Pays', 'Marque', 'Décision', 'Sport', 'Produit local'];
           this.createArticleForm();
            this.getAuthors();
          // this.media = res.article.included[0].attributes.name;
          // this.author = res.article.data.attributes.author.name;
        }, error => {
          // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
        });
    }, error => {
      // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
    });
   }

  ngOnInit(): void {
   // this.createArticleForm();
   
  }

  getAuthors() {
    this.authorsService.getAuthors(1, 'created_at' , 'desc', 9999, '', this.mediumId).subscribe(
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

  createArticleForm() {
    if (this.article) {
      this.articleForm = new UntypedFormGroup({
        title: new UntypedFormControl(this.article.attributes.title, [Validators.required, Validators.minLength(2)]),
        author_id: new UntypedFormControl(String(this.article.attributes.author.id), [Validators.required]),
        valueBind: new UntypedFormControl(this.valueBind, [Validators.required]),
        date_published: new UntypedFormControl(new Date(this.article.attributes.date_published), [Validators.required]),
        sector_id: new UntypedFormControl(null, [Validators.required]),
      });
  }}

  addTagFn(addedName) {
    return { name: addedName, tag: true };
  }

  customSearchAuthor(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.attributes.name.toLocaleLowerCase().indexOf(term) > -1
  }


  editArticle(event) {
    // event.preventDefault();

    if (this.articleForm.valid) {

      if (this.article) {
          const date = this.articleForm.value.date_published
          const object = new Articles;
          object.id = this.article.id;
          object.title = this.articleForm.value.title;
          object.author_id = this.articleForm.value.author_id;
          object.date_published = new Date(date)
          object.body = this.articleForm.value.valueBind;
          this.articlesService.updateArticle(object).subscribe(resCreate => {

         
            this.router.navigate(['/admin/articles-for-sort']); 
            this.notifications.create('Success', "Mettre à jour l'article avec succès", NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

          }, err => {
            
            this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

          });
        

      }
    }
  }

}
