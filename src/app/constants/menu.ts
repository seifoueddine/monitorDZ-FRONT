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
  //   to: '/app/vien',
  //   subs: [
  //     {
  //       icon: 'simple-icon-paper-plane',
  //       label: 'menu.start',
  //       to: '/app/vien/start'
  //     }
  //   ]
  // },
  {
    id: 'slugs',
    icon: 'iconsminds-building',
    label: 'menu.slugs',
    to: '/app/slugs'
  },
  {
    id: 'sectors',
    icon: 'iconsminds-gear',
    label: 'menu.sectors',
    to: '/app/sectors'
  },
  {
    id: 'media',
    icon: 'iconsminds-newspaper',
    label: 'menu.media',
    to: '/app/media'
  }
];
export default data;
