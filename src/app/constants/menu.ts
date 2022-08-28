export interface IMenuItem {
  id?: string;
  icon?: string;
  label: string;
  to: string;
  newWindow?: boolean;
  subs?: IMenuItem[];
}

const data: IMenuItem[] = [
  // {
  //   id: 'vien',
  //   icon: 'iconsminds-air-balloon-1',
  //   label: 'menu.vien',
  //   to: '/admin/vien',
  //   subs: [
  //     {
  //       icon: 'simple-icon-paper-plane',
  //       label: 'menu.start',
  //       to: '/admin/vien/start'
  //     }
  //   ]
  // },
  {
    id: 'slugs',
    icon: 'iconsminds-building',
    label: 'menu.slugs',
    to: '/admin/slugs'
  },
  {
    id: 'sectors',
    icon: 'iconsminds-gear',
    label: 'menu.sectors',
    to: '/admin/sectors'
  },
  {
    id: 'media',
    icon: 'iconsminds-newspaper',
    label: 'menu.media',
    to: '/admin/media'
  },
  {
    id: 'campaigns',
    icon: 'simple-icon-flag',
    label: 'menu.campaigns',
    to: '/admin/campaigns'
  },
  {
    id: 'articles',
    icon: 'iconsminds-testimonal',
    label: 'menu.articles',
    to: '/admin/articles'
  },
  {
    id: 'tags',
    icon: 'simple-icon-tag',
    label: 'menu.tags',
    to: '/admin/tags'
  },
  {
    id: 'users',
    icon: 'simple-icon-people',
    label: 'menu.users',
    to: '/admin/users'
  }
];
export default data;
