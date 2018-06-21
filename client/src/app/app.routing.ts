import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'c', pathMatch: 'full'},
  { path: 'c', loadChildren: './core/core.module#CoreModule'},
  { path: 'a', loadChildren: './account/account.module#AccountModule' },
  { path: '**', component: PageNotFoundComponent }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(routes);