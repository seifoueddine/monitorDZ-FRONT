import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { LoginGuard } from "src/app/core/login.guard";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "articles-for-sort" },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
        canActivate: [LoginGuard],
        data: {
          roles: ["GodLike"],
        },
      },

      {
        path: "slugs",
        loadChildren: () =>
          import("./slugs/slugs.module").then((m) => m.SlugsModule),
        canActivate: [LoginGuard],
        data: {
          roles: ["GodLike"],
        },
      },

      {
        path: "authors",
        loadChildren: () =>
          import("./authors/authors.module").then((m) => m.AuthorsModule),
        canActivate: [LoginGuard],
        data: {
          roles: ["GodLike"],
        },
      },

      // { path: 'sectors', loadChildren: () => import('./sectors/sectors.module').then(m => m.SectorsModule), canActivate: [LoginGuard],
      // data: {
      //   roles: ['GodLike']
      // } },
      {
        path: "media",
        loadChildren: () =>
          import("./media/media.module").then((m) => m.MediaModule),
        canActivate: [LoginGuard],
        data: {
          roles: ["GodLike"],
        },
      },
      {
        path: "campaigns",
        loadChildren: () =>
          import("./campaigns/campaigns.module").then((m) => m.CampaignsModule),
        canActivate: [LoginGuard],
        data: {
          roles: ["GodLike"],
        },
      },
      {
        path: "articles",
        loadChildren: () =>
          import("./articles/articles.module").then((m) => m.ArticlesModule),
        canActivate: [LoginGuard],
        data: {
          roles: ["GodLike", "SuperOP"],
        },
      },
      {
        path: "tags",
        loadChildren: () =>
          import("./tags/tags.module").then((m) => m.TagsModule),
        canActivate: [LoginGuard],
        data: {
          roles: ["GodLike", "SuperOP"],
        },
      },
      {
        path: "search",
        loadChildren: () =>
          import("./search/search.module").then((m) => m.SearchModule),
        canActivate: [LoginGuard],
        data: {
          roles: ["GodLike", "SuperOP"],
        },
      },
      {
        path: "users",
        loadChildren: () =>
          import("./users/users.module").then((m) => m.UsersModule),
        canActivate: [LoginGuard],
        data: {
          roles: ["GodLike"],
        },
      },
      {
        path: "articles-for-sort",
        loadChildren: () =>
          import("./sort-articles/sort-articles.module").then(
            (m) => m.SortArticlesModule
          ),
        canActivate: [LoginGuard],
        data: {
          roles: ["GodLike", "SuperOP"],
        },
      },
      {
        path: "my-profile",
        loadChildren: () =>
          import("./my-profile/my-profile.module").then(
            (m) => m.MyProfileModule
          ),
        canActivate: [LoginGuard],
        data: {
          roles: ["GodLike", "SuperOP"],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
