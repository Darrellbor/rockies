import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'c', pathMatch: 'full'},
  { path: 'c', loadChildren: './core/core.module#CoreModule'},
  { path: 'a', loadChildren: './account/account.module#AccountModule', canActivate: [AuthGuard]},
  { path: '**', component: PageNotFoundComponent }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(routes);