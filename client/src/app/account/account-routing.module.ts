import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { MyEventResolveService } from './resolves/my-event-resolve.service';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { EditEventResolveService } from './resolves/edit-event-resolve.service';
import { ManageEventComponent } from './components/manage-event/manage-event.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { MyOrdersResolveService } from './resolves/my-orders-resolve.service';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderDetailsResolveService } from './resolves/order-details-resolve.service';
import { MyReviewsComponent } from './components/my-reviews/my-reviews.component';
import { MyReviewsResolveService } from './resolves/my-reviews-resolve.service';
import { CreateOrganizerComponent } from './components/create-organizer/create-organizer.component';
import { MyOrganizersComponent } from './components/my-organizers/my-organizers.component';
import { MyOrganizersResolveService } from './resolves/my-organizers-resolve.service';
import { EditOrganizerComponent } from './components/edit-organizer/edit-organizer.component';
import { EditOrganizerResolveService } from './resolves/edit-organizer-resolve.service';

export const routes: Routes = [
    { path: '', redirectTo: 'create-event', pathMatch: 'full' },
    { path: 'create-event', component: CreateEventComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'myEvents', component: MyEventsComponent, resolve: { myEvents: MyEventResolveService } },
    { path: 'myEvents/edit/:id', component: EditEventComponent, resolve: { eventDetails: EditEventResolveService } },
    { path: 'myEvents/:id', component: ManageEventComponent, resolve: { eventDetails: EditEventResolveService } },
    { path: 'myOrders', component: MyOrdersComponent, resolve: { myOrders: MyOrdersResolveService } },
    { path: 'myOrders/:eventId/order/:orderId', component: OrderDetailsComponent, resolve: { orderDetails: OrderDetailsResolveService } },
    { path: 'myReviews', component: MyReviewsComponent, resolve: { myReviews: MyReviewsResolveService } },
    { path: 'organizers/create', component: CreateOrganizerComponent },
    { path: 'organizers', component: MyOrganizersComponent, resolve: { myOrganizers: MyOrganizersResolveService } },
    { path: 'organizers/edit/:url', component: EditOrganizerComponent, resolve: { organizerDetails: EditOrganizerResolveService } }
];

export const AccountRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
