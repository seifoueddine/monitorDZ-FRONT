import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule as FormsModuleAngular, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NouisliderModule } from 'ng2-nouislider';
import { ArchwizardModule } from 'angular-archwizard';
import { ComponentsCarouselModule } from 'src/app/components/carousel/components.carousel.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ComponentsPlayerModule } from 'src/app/components/player/components.player.module';
import { ComponentsCardsModule } from 'src/app/components/cards/components.cards.module';
import { ComponentsPagesModule } from 'src/app/components/pages/components.pages.module';
import { LightboxModule } from 'ngx-lightbox';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MyProfileComponent } from './my-profile.component';
import { MyProfileRoutingModule } from './my-profile.routing';
import { ProfileFormComponent } from './profile-form/profile-form.component';


@NgModule({
  declarations: [MyProfileComponent, ProfileFormComponent],
  imports: [
    SharedModule,
    LayoutContainersModule,
    MyProfileRoutingModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    FormsModuleAngular,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    CollapseModule,
    NgSelectModule,
    LightboxModule,
    ComponentsPagesModule,
    ComponentsCardsModule,
    ComponentsPlayerModule,
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TranslateModule,
    NgxDatatableModule,
    ComponentsCarouselModule,
    ArchwizardModule,
    AlertModule.forRoot(),
    NouisliderModule,
  ]
})
export class MyProfileModule { }
