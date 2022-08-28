import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const roles = next.data && next.data.roles ? next.data.roles : undefined;
    const currentPath = next.routeConfig.path;
    return this.authenticatedConditions(roles);

    //  const user = localStorage.getItem('user');
    //  const userObject =  JSON.parse(user);
    //  if ( userObject.role === 'admin') {
    // this.router.navigate(['/app/users']);
    //   return true;
    //  }else {
    // this.router.navigate(['/app/checks']);
    //   return true;
    //  }

    // this.router.navigate(['/app/checks']);
    // return false;
  }

  // canActivateChild(
  //   childRoute: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

  //     const roles = childRoute.data && childRoute.data.roles ? childRoute.data.roles : undefined;
  //     return this.authenticatedConditions(roles);

  // }

  authenticatedConditions(roles: string): boolean {
    if (localStorage.getItem("isLoggedin")) {
      return this.checkRoles(roles);
    }
  }

  checkRoles(roles: string): boolean {
    const user = localStorage.getItem("user");
    const userObject = JSON.parse(user);
    const role = userObject.role;
    if (roles) {
      let hasAccess = false;

      // const userType = localStorage.getItem('userType');

      if (roles.includes(role)) {
        hasAccess = true;
      } else {
        switch (role) {
          case "GodLike":
            this.router.navigate(["/admin/dashboard"]);
            break;
          case "SuperOP":
            this.router.navigate(["/admin/articles-for-sort"]);
            break;
          case "ClientAdmin":
            this.router.navigate(["/client/client-articles"]);
            break;
          default:
            break;
        }
      }

      return hasAccess;
    } else {
      return true;
    }
  }
}
