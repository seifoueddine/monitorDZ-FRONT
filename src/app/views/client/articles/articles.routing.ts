import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ArticlesComponent } from "./articles.component";
import { DetailsArticleComponent } from "./details-article/details-article.component";

const routes: Routes = [
  {
    path: "",
    component: ArticlesComponent,
  },
  { path: "details", component: DetailsArticleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesRoutingModule {}
