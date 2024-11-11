import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'dashboard',
    title: 'Yönetim Paneli',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'home',
        title: 'Ana Sayfa',
        type: 'item',
        classes: 'nav-item',
        url: '/home',
        icon: 'ti ti-home',
        breadcrumbs: false
      },
      {
        id: 'customers',
        title: 'Kullanıcılar',
        type: 'item',
        classes: 'nav-item',
        url: '/customers',
        icon: 'ti ti-user',
        breadcrumbs: false
      },
      {
        id: 'products',
        title: 'Ürünler',
        type: 'item',
        classes: 'nav-item',
        url: '/products',
        icon: 'ti ti-package',
        breadcrumbs: false
      },
      {
        id: 'categories',
        title: 'Kategoriler',
        type: 'item',
        classes: 'nav-item',
        url: '/categories',
        icon: 'ti ti-category',
        breadcrumbs: false
      },
      {
        id: 'orders',
        title: 'Siparişler',
        type: 'item',
        classes: 'nav-item',
        url: '/orders',
        icon: 'ti ti-receipt',
        breadcrumbs: false
      }
    ]
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
