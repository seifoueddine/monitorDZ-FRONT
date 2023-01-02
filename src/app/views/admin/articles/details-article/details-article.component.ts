import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Lightbox } from 'ngx-lightbox';
import { Articles } from 'src/app/shared/models/articles.model';
import { environment } from 'src/environments/environment';
import { jsPDF } from 'jspdf';
import saveAs from 'file-saver';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { OpenAIApi } from 'openai';


@Component({
  selector: 'app-details-article',
  templateUrl: './details-article.component.html',
  styleUrls: ['./details-article.component.scss']
})
export class DetailsArticleComponent implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild('pdfTable') pdfTable: ElementRef;
  buttonState = '';
  name = 'Angular';
  valueBind: string;
  articleId: any;
  article: any;
  detailImages: any;
  owner: any;
  defaultImage = "assets/img/no-image-article.png"
  robotWrite = false;
  //defaultImage = "https://review.content-science.com/wp-content/uploads/2015/09/CSR_article_hero_Complex-Transformation-of-Moving-from-Print-to-Digital-Content-ECRIs-Story.png"
  urlForImage = environment.URL_PATH;
  configTimeModal = {
    ignoreBackdropClick: true
  };
  article_status: boolean = false;
  bsValue = new Date();
  tags: any;
  mediaName: string;
  authorName: string;
  modalRef: any;
  modalRefEmail: any;
  body: any;
  similar: any;
  role: any;
  email = "";
  public options = {
    position: ["bottom", "center"],
  };
  spinner: boolean;
  tagsName: any[];
  message: any;
  groups = [
  ];
  constructor(private route: ActivatedRoute, private articlesService: ArticlesService, private router: Router, private modalService: BsModalService, private openai: OpenAIApi,
    private modal: BsModalService, private notifications: NotificationsService, private lightbox: Lightbox, private datePipe: DatePipe, private sanitizer: DomSanitizer) {


    this.route
      .queryParams
      .subscribe(params => {
        this.articleId = params['id'];

        this.articlesService.getArticleById(this.articleId)
          .subscribe((res: any) => {
            this.article = res.article.data;
            this.article.attributes.body = '<div dir="auto" >' + this.article.attributes.body + '</div>';
            this.tags = res.tags;
            this.mediaName = res.article.included[0].attributes.name;
            this.authorName = res.article.data.attributes.author.name;
            this.similar = res.similar.data;
            this.similar = this.similar.filter(a => a.id !== this.article.id);
            this.getBodyWithTags();
          }, error => {
            // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
          });
      }, error => {
        // this.snackBar.open(error.error.message, 'close', { verticalPosition: 'top', panelClass: ['error-snackbar'] });
      });


    const user = localStorage.getItem('user');
    const userObject = JSON.parse(user);
    if (userObject) {
      this.role = userObject.role;
    }



  }


  openModalEmail(templateEmail: TemplateRef<any>) {
    this.modalRefEmail = this.modalService.show(templateEmail, { class: 'modal-sm' });
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

  declineEmail(): void {


    this.modalRefEmail.hide();
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


  getBodyWithTags() {

    this.tags.map(t => {
      let tag = t.name.trim();
      let Tag = tag.replace(tag[0], tag[0].toUpperCase());
      let TAG = tag.replace(tag, tag.toUpperCase());
      let re = new RegExp(tag, 'g');
      let TagRe = new RegExp(Tag, 'g');
      let TAGRe = new RegExp(TAG, 'g');


      this.article.attributes.body = this.article.attributes.body.replace(TAGRe, '<span style="padding-right: 2px; padding-left: 2px; border-radius: 5px; border: 1px solid #73b0ff; background-color:#95bff5;";font-weight:bold">' + TAG + '</span>');

      this.article.attributes.body = this.article.attributes.body.replace(TagRe, '<span style="padding-right: 2px; padding-left: 2px; border-radius: 5px; border: 1px solid #73b0ff; background-color:#95bff5;";font-weight:bold">' + Tag + '</span>');

      this.article.attributes.body = this.article.attributes.body.replace(re, '<span style="padding-right: 2px; padding-left: 2px; border-radius: 5px; border: 1px solid #73b0ff; background-color:#95bff5;";font-weight:bold">' + tag + '</span>');
    })

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
    return this.sanitizer.bypassSecurityTrustHtml('<div style="font-size: 15px !important;">' + body + '</div>');


  }






  exportPDF() {
    this.buttonState = 'show-spinner';
    this.articlesService.exportPDF(this.articleId).subscribe(res => {
      const blob = new Blob([res.body], { type: 'application/pdf' });
      saveAs.saveAs(blob, "Article by " + this.mediaName);
      this.buttonState = '';
    }, err => {
      this.buttonState = '';
      // this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
    });
  }


  SendMail() {
    if (this.email != '') {
      this.articlesService.sendEmail(this.articleId, this.email).subscribe(res => {
        this.modalRefEmail.hide();
        this.notifications.create('Success', 'Envoie email avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

      }, err => {
        this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      });
    } else {
      this.notifications.create('', 'Merci de Mettre email du destinataire', NotificationType.Warn, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
    }

  }


  selectTag(tag) {
    this.robotWrite = true;
    this.tagsName = [];
    const langArray = tag;
    switch (tag) {
      case "Un résumé de l'article":

        // for (let i = 0; i < 3; i++) {
        this.sendMessage('résumé');
        // }
        // this.robotWrite = false;

        break;
      case "Extraire les personnes existantes dans l'article":
        // for (let i = 0; i < 3; i++) {
        this.sendMessage('personnes existantes');
        // }
        break;
      case "Extraire les chiffres existants dans l'article":
        // for (let i = 0; i < 3; i++) {
        this.sendMessage('chiffres existants');
        // }  
        break;
      case "Extraire les dates existantes dans l'article":
        // for (let i = 0; i < 3; i++) {
        this.sendMessage('dates existantes');
        // }   
        break;
      default:
        break;
    }




  }


  sendMessage(choise) {
    switch (choise) {
      case "résumé":
        this.message = "donne moi un résumé de cet article: " + this.article.attributes.body
        break;
      case "personnes existantes":
        this.message = "extrais moi les personnes existantes avec leur status dans cet text: " + this.article.attributes.body
        break;
      case "chiffres existants":
        this.message = "extrais moi les chiffres leur clés et leur labels en excluant les dates en colonne de ce texte : " + this.article.attributes.body
        break;
      case "dates existantes":
        this.message = "extrais moi les dates avec leur événements en colonne de ce texte : " + this.article.attributes.body
        break;
    }

    if (this.message.length > 0) {
      this.sendToopenai(choise)

    }
  }
  sendToopenai(choise) {

    this.openai.createCompletion({ model: 'text-davinci-003', prompt: this.message, max_tokens: 1200, }, { headers: { 'Authorization': `Bearer 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` } }).then((response) => {
      let respons = response?.data?.choices[0]?.text.replace(/^\n\n/, '').replace(/\n/g, '<br>');

      this.addGroupItem(respons, choise)
      this.robotWrite = false;
    }, (error) => {

      this.robotWrite = false;
    });

  }

  addGroupItem(respons, choise): void {
    this.groups.push({
      title: `${choise} - ${this.groups.length + 1}`,
      content: respons
    });
  }



}
