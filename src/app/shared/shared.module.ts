import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from '../views/error/error.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { sanitizeHtmlPipe } from './sanitize-html.pipe';
@NgModule({
  declarations: [ErrorComponent, sanitizeHtmlPipe], 
  imports: [
    RouterModule,
    CommonModule,
    TranslateModule,
    PerfectScrollbarModule,
  ],
  exports: [
    PerfectScrollbarModule,
    RouterModule,
    ErrorComponent,
    TranslateModule,
    CommonModule,
    sanitizeHtmlPipe
  ]
})
export class SharedModule { }
