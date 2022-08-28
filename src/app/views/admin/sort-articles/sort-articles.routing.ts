import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SortArticlesComponent } from './sort-articles.component';



const routes: Routes = [
    {
        path: '', component: SortArticlesComponent
   
    } ,
    // { path: 'details', component: DetailsArticleComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SortArticlesRoutingModule { }
