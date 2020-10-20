import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDetailsComponent } from './list-details/list-details.component';
import { ListsComponent } from './lists.component';


const routes: Routes = [
    {
        path: '', component: ListsComponent,
      
    },
    { path: 'all-articles', component: ListDetailsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListsRoutingModule { }
