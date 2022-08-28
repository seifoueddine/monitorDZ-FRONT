import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [BlankPageComponent, AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    LayoutContainersModule,
    TranslateModule,
  ]
})
export class AdminModule { }

