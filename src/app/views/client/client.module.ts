import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { BlankPageComponent } from '../admin/blank-page/blank-page.component';
import { ClientComponent } from "./client.component";
import { ClientRoutingModule } from "./client.routing";
import { SharedModule } from "src/app/shared/shared.module";
import { LayoutContainersModule } from "src/app/containers/layout/layout.containers.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ClientComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule,
    LayoutContainersModule,
    TranslateModule,
  ],
})
export class ClientModule {}
