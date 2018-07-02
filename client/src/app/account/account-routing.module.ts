import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: 'create-event', pathMatch: 'full' },
    { path: 'create-event', component: CreateEventComponent },
    { path: 'profile', component: ProfileComponent }
];

export const AccountRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
