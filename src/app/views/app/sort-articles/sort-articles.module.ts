import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { LightboxModule } from 'ngx-lightbox';
import { ComponentsPagesModule } from 'src/app/components/pages/components.pages.module';
import { ComponentsCardsModule } from 'src/app/components/cards/components.cards.module';
import { ComponentsPlayerModule } from 'src/app/components/player/components.player.module';
import { BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsCarouselModule } from 'src/app/components/carousel/components.carousel.module';
import { ArchwizardModule } from 'angular-archwizard';
import { PaginationModule } from 'ngx-bootstrap/pagination'
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';
import { sanitizeHtmlPipe } from 'src/app/shared/sanitize-html.pipe';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { SortArticlesComponent } from './sort-articles.component';
import { SortArticlesRoutingModule } from './sort-articles.routing';
import { ContextMenuModule } from 'ngx-contextmenu';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
  declarations: [SortArticlesComponent],
  imports: [
    SharedModule,
    LayoutContainersModule,
    PagesContainersModule,
    SortArticlesRoutingModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    CollapseModule,
    LightboxModule,
    ComponentsPagesModule,
    ComponentsCardsModule,
    ComponentsPlayerModule,
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    NgxDatatableModule,
    ComponentsCarouselModule,
    NgSelectModule,
    QuillModule.forRoot(),
    ComponentsStateButtonModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    BsDatepickerModule.forRoot(),
  ],
  providers:    [  DatePipe, BsDropdownDirective  ],
})
export class SortArticlesModule { }
