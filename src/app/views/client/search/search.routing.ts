import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDetailsComponent } from '../../client/lists/list-details/list-details.component';
import { SearchComponent } from './search.component';


const routes: Routes = [
    {
        path: '', component: SearchComponent,
      
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SearchRoutingModule { }
