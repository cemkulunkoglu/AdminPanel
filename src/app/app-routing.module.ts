import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./demo/home/home.component').then((c) => c.HomeComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./demo/customers/customers.component').then((c) => c.CustomersComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./demo/products/products.component').then((c) => c.ProductsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./demo/categories/categories.component').then((c) => c.CategoriesComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./demo/orders/orders.component').then((c) => c.OrdersComponent)
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'guest',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
