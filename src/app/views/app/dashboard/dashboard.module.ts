import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { SimpleNotificationsModule } from 'angular2-notifications';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    LayoutContainersModule,
    TranslateModule,
    ComponentsChartModule,
    SimpleNotificationsModule.forRoot(),
  ]
})
export class DashboardModule { }
