import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClientComponent } from "./client.component";
import { LoginGuard } from "src/app/core/login.guard";

const routes: Routes = [
  {
    path: "",
    component: ClientComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "articles-for-sort" },
      {
        path: "client-dashboard",
        loadChildren: () =>
          import("./client-dashboard/client-dashboard.module").then(
            (m) => m.ClientDashboardModule
          ),
        canActivate: [LoginGuard],
        data: {
          roles: ["ClientAdmin"],
        },
      },
      {
        path: "articles",
        loadChildren: () =>
          import("../client/articles/articles.module").then(
            (m) => m.ArticlesModule
          ),
        canActivate: [LoginGuard],
        data: {
          roles: ["ClientAdmin"],
        },
      },
      {
        path: "search",
        loadChildren: () =>
          import("../client/search/search.module").then((m) => m.SearchModule),
        canActivate: [LoginGuard],
        data: {
          roles: ["ClientAdmin"],
        },
      },

      {
        path: "client-articles",
        loadChildren: () =>
          import("./client-articles/client-articles.module").then(
            (m) => m.ClientArticlesModule
          ),
        canActivate: [LoginGuard],
        data: {
          roles: ["ClientAdmin"],
        },
      },
      {
        path: "lists",
        loadChildren: () =>
          import("./lists/lists.module").then((m) => m.ListsModule),
        canActivate: [LoginGuard],
        data: {
          roles: ["ClientAdmin"],
        },
      },
      {
        path: "my-profile",
        loadChildren: () =>
          import("../client/my-profile/my-profile.module").then(
            (m) => m.MyProfileModule
          ),
        canActivate: [LoginGuard],
        data: {
          roles: ["ClientAdmin"],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
