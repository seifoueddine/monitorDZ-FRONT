import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientArticlesComponent } from './client-articles.component';


const routes: Routes = [
    {
        path: '', component: ClientArticlesComponent
    } ,
    // { path: 'details', component: DetailsArticleComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientArticlesRoutingModule { }
