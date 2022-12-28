import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter, map } from "rxjs/operators";
import { SidebarService, ISidebar } from "./sidebar.service";
import menuItems, { IMenuItem } from "src/app/constants/menu";
import { Subscription } from "rxjs";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: IMenuItem[] = menuItems;
  selectedParentMenu = "";
  viewingParentMenu = "";
  currentUrl: string;

  sidebar: ISidebar;
  subscription: Subscription;
  closedCollapseList = [];

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .subscribe((event) => {
        const path = this.router.url.split("?")[0];
        const paramtersLen = Object.keys(event.snapshot.params).length;
        const pathArr = path
          .split("/")
          .slice(0, path.split("/").length - paramtersLen);
        this.currentUrl = pathArr.join("/");
      });

    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const { containerClassnames } = this.sidebar;
        const toParentUrl = this.currentUrl
          .split("/")
          .filter((x) => x !== "")[1];
        if (toParentUrl !== undefined && toParentUrl !== null) {
          this.selectedParentMenu = toParentUrl.toLowerCase();
        } else {
          this.selectedParentMenu = "dashboards";
        }
        this.selectMenu();
        this.toggle();
        this.sidebarService.setContainerClassnames(
          0,
          "menu-sub-hidden",
          this.sidebar.selectedMenuHasSubItems
        );
        window.scrollTo(0, 0);
      });

    const user = localStorage.getItem("user");
    const userObject = JSON.parse(user);
    if (userObject) {
      const role = userObject.role;

      switch (role) {
        case "GodLike":
          this.menuItems = [
            {
              id: "dashboard",
              icon: "iconsminds-monitor-analytics",
              label: "menu.dashboard",
              to: "/admin/dashboard",
            },
            {
              id: "slugs",
              icon: "iconsminds-building",
              label: "menu.slugs",
              to: "/admin/slugs",
            },
            // {
            //   id: 'sectors',
            //   icon: 'iconsminds-gear',
            //   label: 'menu.sectors',
            //   to: '/admin/sectors'
            // },
            {
              id: "media",
              icon: "iconsminds-newspaper",
              label: "menu.media",
              to: "/admin/media",
            },
            {
              id: "authors",
              icon: "iconsminds-mens",
              label: "menu.authors",
              to: "/admin/authors",
            },
            {
              id: "campaigns",
              icon: "simple-icon-flag",
              label: "menu.campaigns",
              to: "/admin/campaigns",
            },
            {
              id: "articles",
              icon: "iconsminds-testimonal",
              label: "menu.articles",
              to: "/admin/articles",
            },
            {
              id: "sort-articles",
              icon: "iconsminds-check",
              label: "menu.articles-sort",
              to: "/admin/articles-for-sort",
            },
            {
              id: "tags",
              icon: "simple-icon-tag",
              label: "menu.tags",
              to: "/admin/tags",
            },
            {
              id: "users",
              icon: "simple-icon-people",
              label: "menu.users",
              to: "/admin/users",
            },
            {
              id: "Funny Chat",
              icon: "simple-icon-bubbles",
              label: "menu.chat",
              to: "/admin/chat",
            },
          ];
          break;
        case "SuperOP":
          this.menuItems = [
            {
              id: "sort-articles",
              icon: "iconsminds-check",
              label: "menu.articles",
              to: "/admin/articles-for-sort",
            },
            {
              id: "tags",
              icon: "simple-icon-tag",
              label: "menu.tags",
              to: "/admin/tags",
            },
          ];
        case "ClientAdmin":
          this.menuItems = [
            {
              id: "dashboard",
              icon: "iconsminds-monitor-analytics",
              label: "menu.dashboard",
              to: "/client/client-dashboard",
            },

            {
              id: "client-articles",
              icon: "iconsminds-key-lock",
              label: "menu.articles",
              to: "/client/client-articles",
            },
            {
              id: "lists",
              icon: "simple-icon-list",
              label: "menu.lists",
              to: "/client/lists",
            },
          ];
          // default:
          break;
      }

      //   if(role === 'GodLike'){
      //     this.menuItems = [
      //       {
      //         id: 'slugs',
      //         icon: 'iconsminds-building',
      //         label: 'menu.slugs',
      //         to: '/app/slugs'
      //       },
      //       {
      //         id: 'sectors',
      //         icon: 'iconsminds-gear',
      //         label: 'menu.sectors',
      //         to: '/app/sectors'
      //       },
      //       {
      //         id: 'media',
      //         icon: 'iconsminds-newspaper',
      //         label: 'menu.media',
      //         to: '/app/media'
      //       },
      //       {
      //         id: 'campaigns',
      //         icon: 'simple-icon-flag',
      //         label: 'menu.campaigns',
      //         to: '/app/campaigns'
      //       },
      //       {
      //         id: 'articles',
      //         icon: 'iconsminds-testimonal',
      //         label: 'menu.articles',
      //         to: '/app/articles'
      //       },
      //       {
      //         id: 'tags',
      //         icon: 'simple-icon-tag',
      //         label: 'menu.tags',
      //         to: '/app/tags'
      //       },
      //       {
      //         id: 'users',
      //         icon: 'simple-icon-people',
      //         label: 'menu.users',
      //         to: '/app/users'
      //       }
      //   ];

      // }else {
      //   this.menuItems = [
      //     {
      //       id: 'check',
      //       icon: 'iconsminds-check',
      //       label: 'menu.check',
      //       to: '/app/checks'
      //     }

      //   ];
      // }
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.selectMenu();
      const { containerClassnames } = this.sidebar;
      const nextClasses = this.getMenuClassesForResize(containerClassnames);
      this.sidebarService.setContainerClassnames(
        0,
        nextClasses.join(" "),
        this.sidebar.selectedMenuHasSubItems
      );
      this.isCurrentMenuHasSubItem();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectMenu() {
    const currentParentUrl = this.currentUrl
      .split("/")
      .filter((x) => x !== "")[1];
    if (currentParentUrl !== undefined && currentParentUrl !== null) {
      this.selectedParentMenu = currentParentUrl.toLowerCase();
    } else {
      this.selectedParentMenu = "dashboards";
    }
    this.isCurrentMenuHasSubItem();
  }

  isCurrentMenuHasSubItem() {
    const { containerClassnames } = this.sidebar;

    const menuItem = this.menuItems.find(
      (x) => x.id === this.selectedParentMenu
    );
    const isCurrentMenuHasSubItem =
      menuItem && menuItem.subs && menuItem.subs.length > 0 ? true : false;
    if (isCurrentMenuHasSubItem !== this.sidebar.selectedMenuHasSubItems) {
      if (!isCurrentMenuHasSubItem) {
        this.sidebarService.setContainerClassnames(
          0,
          containerClassnames,
          false
        );
      } else {
        this.sidebarService.setContainerClassnames(
          0,
          containerClassnames,
          true
        );
      }
    }
    return isCurrentMenuHasSubItem;
  }

  changeSelectedParentHasNoSubmenu(parentMenu: string) {
    const { containerClassnames } = this.sidebar;
    this.selectedParentMenu = parentMenu;
    this.viewingParentMenu = parentMenu;
    this.sidebarService.changeSelectedMenuHasSubItems(false);
    this.sidebarService.setContainerClassnames(0, containerClassnames, false);
  }

  openSubMenu(event: { stopPropagation: () => void }, menuItem: IMenuItem) {
    if (event) {
      event.stopPropagation();
    }
    const { containerClassnames, menuClickCount } = this.sidebar;

    const selectedParent = menuItem.id;
    const hasSubMenu = menuItem.subs && menuItem.subs.length > 0;
    this.sidebarService.changeSelectedMenuHasSubItems(hasSubMenu);
    if (!hasSubMenu) {
      this.viewingParentMenu = selectedParent;
      this.selectedParentMenu = selectedParent;
      this.toggle();
    } else {
      const currentClasses = containerClassnames
        ? containerClassnames.split(" ").filter((x) => x !== "")
        : "";

      if (!currentClasses.includes("menu-mobile")) {
        if (
          currentClasses.includes("menu-sub-hidden") &&
          (menuClickCount === 2 || menuClickCount === 0)
        ) {
          this.sidebarService.setContainerClassnames(
            3,
            containerClassnames,
            hasSubMenu
          );
        } else if (
          currentClasses.includes("menu-hidden") &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.sidebarService.setContainerClassnames(
            2,
            containerClassnames,
            hasSubMenu
          );
        } else if (
          currentClasses.includes("menu-default") &&
          !currentClasses.includes("menu-sub-hidden") &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.sidebarService.setContainerClassnames(
            0,
            containerClassnames,
            hasSubMenu
          );
        }
      } else {
        this.sidebarService.addContainerClassname(
          "sub-show-temporary",
          containerClassnames
        );
      }
      this.viewingParentMenu = selectedParent;
    }
  }

  toggle() {
    const { containerClassnames, menuClickCount } = this.sidebar;
    const currentClasses = containerClassnames
      .split(" ")
      .filter((x) => x !== "");
    if (currentClasses.includes("menu-sub-hidden") && menuClickCount === 3) {
      this.sidebarService.setContainerClassnames(
        2,
        containerClassnames,
        this.sidebar.selectedMenuHasSubItems
      );
    } else if (
      currentClasses.includes("menu-hidden") ||
      currentClasses.includes("menu-mobile")
    ) {
      if (!(menuClickCount === 1 && !this.sidebar.selectedMenuHasSubItems)) {
        this.sidebarService.setContainerClassnames(
          0,
          containerClassnames,
          this.sidebar.selectedMenuHasSubItems
        );
      }
    }
  }

  toggleCollapse(id: string) {
    if (this.closedCollapseList.includes(id)) {
      this.closedCollapseList = this.closedCollapseList.filter((x) => x !== id);
    } else {
      this.closedCollapseList.push(id);
    }
  }

  getMenuClassesForResize(classes: string) {
    let nextClasses = classes.split(" ").filter((x: string) => x !== "");
    const windowWidth = window.innerWidth;

    if (windowWidth < this.sidebarService.menuHiddenBreakpoint) {
      nextClasses.push("menu-mobile");
    } else if (windowWidth < this.sidebarService.subHiddenBreakpoint) {
      nextClasses = nextClasses.filter((x: string) => x !== "menu-mobile");
      if (
        nextClasses.includes("menu-default") &&
        !nextClasses.includes("menu-sub-hidden")
      ) {
        nextClasses.push("menu-sub-hidden");
      }
    } else {
      nextClasses = nextClasses.filter((x: string) => x !== "menu-mobile");
      if (
        nextClasses.includes("menu-default") &&
        nextClasses.includes("menu-sub-hidden")
      ) {
        nextClasses = nextClasses.filter(
          (x: string) => x !== "menu-sub-hidden"
        );
      }
    }
    return nextClasses;
  }

  @HostListener("document:click", ["$event"])
  handleDocumentClick(event) {
    this.viewingParentMenu = "";
    this.selectMenu();
    this.toggle();
  }

  @HostListener("window:resize", ["$event"])
  handleWindowResize(event) {
    if (event && !event.isTrusted) {
      return;
    }
    const { containerClassnames } = this.sidebar;
    const nextClasses = this.getMenuClassesForResize(containerClassnames);
    this.sidebarService.setContainerClassnames(
      0,
      nextClasses.join(" "),
      this.sidebar.selectedMenuHasSubItems
    );
    this.isCurrentMenuHasSubItem();
  }

  menuClicked(e: MouseEvent) {
    e.stopPropagation();
  }
}
