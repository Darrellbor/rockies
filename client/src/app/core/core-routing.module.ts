import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { EventComponent } from './components/event/event.component';
import { OrganizerComponent } from './components/organizer/organizer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeResolveService } from './resolves/home-resolve.service';
import { SearchFilterResolveService } from './resolves/search-filter-resolve.service';
import { EventResolveService } from './resolves/event-resolve.service';
import { OrganizerResolveService } from './resolves/organizer-resolve.service';
import { NotAuthGuard } from '../guards/not-auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, resolve: { recommendedEvents: HomeResolveService } },
  { path: 'sf', component: SearchFilterComponent, resolve: { filteredEvents: SearchFilterResolveService }},
  { path: 'e/:url', component: EventComponent, resolve: { eventDetails: EventResolveService }},
  { path: 'o/:url', component: OrganizerComponent, resolve: { organizerDetails: OrganizerResolveService }},
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard] }
];

export const CoreRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
