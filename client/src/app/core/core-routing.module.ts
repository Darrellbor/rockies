import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { EventComponent } from './components/event/event.component';
import { HomeResolveService } from './resolves/home-resolve.service';
import { SearchFilterResolveService } from './resolves/search-filter-resolve.service';
import { EventResolveService } from './resolves/event-resolve.service';

export const routes: Routes = [
  { path: '', component: HomeComponent, resolve: { recommendedEvents: HomeResolveService } },
  { path: 'sf', component: SearchFilterComponent, resolve: { filteredEvents: SearchFilterResolveService }},
  { path: 'e/:url', component: EventComponent, resolve: { eventDetails: EventResolveService }}
];

export const CoreRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
