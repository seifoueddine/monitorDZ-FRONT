import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ClientDashboardComponent } from "./client-dashboard.component";
import { ClientDashboardRoutingModule } from "./client-dashboard.routing";
import { SharedModule } from "src/app/shared/shared.module";
import { LayoutContainersModule } from "src/app/containers/layout/layout.containers.module";
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsChartModule } from "src/app/components/charts/components.charts.module";
import { SimpleNotificationsModule } from "angular2-notifications";
import { PagesContainersModule } from "src/app/containers/pages/pages.containers.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { ComponentsPagesModule } from "src/app/components/pages/components.pages.module";
import { ComponentsCardsModule } from "src/app/components/cards/components.cards.module";
import { ComponentsPlayerModule } from "src/app/components/player/components.player.module";
import { BsDropdownDirective, BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ComponentsCarouselModule } from "src/app/components/carousel/components.carousel.module";
import { ArchwizardModule } from "angular-archwizard";
import { LightboxModule } from "ngx-lightbox";
import { HttpClientModule } from "@angular/common/http";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";

@NgModule({
  declarations: [ClientDashboardComponent],
  imports: [
    CommonModule,
    ClientDashboardRoutingModule,
    SharedModule,
    LayoutContainersModule,
    TranslateModule,
    ComponentsChartModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule,
    ComponentsPagesModule,
    ComponentsCardsModule,
    ComponentsPlayerModule,
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    NgxDatatableModule,
    ComponentsCarouselModule,
    ArchwizardModule,
    ModalModule.forRoot(),
    HttpClientModule,
    LightboxModule,
    BsDatepickerModule.forRoot(),
    PerfectScrollbarModule,
  ],
  providers: [DatePipe, BsDropdownDirective],
})
export class ClientDashboardModule {}
