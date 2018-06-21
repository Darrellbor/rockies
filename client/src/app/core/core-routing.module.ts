import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { HomeResolveService } from './resolves/home-resolve.service';
import { SearchFilterResolveService } from './resolves/search-filter-resolve.service';

export const routes: Routes = [
  { path: '', component: HomeComponent, resolve: { recommendedEvents: HomeResolveService } },
  { path: 'sf', component: SearchFilterComponent, resolve: { filteredEvents: SearchFilterResolveService }}
];

export const CoreRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
