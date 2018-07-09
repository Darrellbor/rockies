import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { MyEventResolveService } from './resolves/my-event-resolve.service';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { EditEventResolveService } from './resolves/edit-event-resolve.service';
import { ManageEventComponent } from './components/manage-event/manage-event.component';

export const routes: Routes = [
    { path: '', redirectTo: 'create-event', pathMatch: 'full' },
    { path: 'create-event', component: CreateEventComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'myEvents', component: MyEventsComponent, resolve: { myEvents: MyEventResolveService } },
    { path: 'myEvents/edit/:id', component: EditEventComponent, resolve: { eventDetails: EditEventResolveService } },
    { path: 'myEvents/:id', component: ManageEventComponent, resolve: { eventDetails: EditEventResolveService } }
];

export const AccountRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
