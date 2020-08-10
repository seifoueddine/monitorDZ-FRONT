import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BlankPageComponent } from './blank-page/blank-page.component';

const routes: Routes = [
    {
        path: '', component: AppComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'slugs' },
            // { path: 'vien', loadChildren: () => import('./vien/vien.module').then(m => m.VienModule) },
            { path: 'slugs', loadChildren: () => import('./slugs/slugs.module').then(m => m.SlugsModule) },
            { path: 'sectors', loadChildren: () => import('./sectors/sectors.module').then(m => m.SectorsModule) },
            { path: 'media', loadChildren: () => import('./media/media.module').then(m => m.MediaModule) },
             { path: 'campaigns', loadChildren: () => import('./campaigns/campaigns.module').then(m => m.CampaignsModule) },
             { path: 'articles', loadChildren: () => import('./articles/articles.module').then(m => m.ArticlesModule) },

            // { path: 'second-menu', loadChildren: () => import('./second-menu/second-menu.module').then(m => m.SecondMenuModule) },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
