import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HomeResolveService } from './resolves/home-resolve.service';

export const routes: Routes = [
  { path: '', component: HomeComponent, resolve: { recommendedEvents: HomeResolveService } }
];

export const CoreRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
