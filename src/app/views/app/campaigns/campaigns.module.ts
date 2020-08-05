import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { LightboxModule } from 'ngx-lightbox';
import { ComponentsPagesModule } from 'src/app/components/pages/components.pages.module';
import { ComponentsCardsModule } from 'src/app/components/cards/components.cards.module';
import { ComponentsPlayerModule } from 'src/app/components/player/components.player.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsCarouselModule } from 'src/app/components/carousel/components.carousel.module';
import { ArchwizardModule } from 'angular-archwizard';
import { PaginationModule } from 'ngx-bootstrap/pagination'
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';

import {CampaignsRoutingModule } from './campaigns.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { CampaignsComponent } from './campaigns.component';
import { CampaignFormComponent } from 'src/app/views/app/campaigns/campaign-form/campaign-form.component';
@NgModule({
  declarations: [CampaignsComponent ,CampaignFormComponent],
  imports: [
    SharedModule,
    LayoutContainersModule,
    PagesContainersModule,
    CampaignsRoutingModule,
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
    ArchwizardModule,
    NgSelectModule,
  ]
})
export class CampaignsModule { }
