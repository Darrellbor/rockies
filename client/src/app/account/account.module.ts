import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ImageUploadModule } from "angular2-image-upload";
import { ColorPickerModule } from 'angular2-color-picker';
import { SharedModule } from '../shared/shared.module';

import { AccountRoutingModule } from './account-routing.module';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { AccountService } from './services/account.service';
import { MyEventResolveService } from './resolves/my-event-resolve.service';
import { EditEventResolveService } from './resolves/edit-event-resolve.service';
import { MyOrdersResolveService } from './resolves/my-orders-resolve.service';
import { OrderDetailsResolveService } from './resolves/order-details-resolve.service';
import { MyReviewsResolveService } from './resolves/my-reviews-resolve.service';
import { MyOrganizersResolveService } from './resolves/my-organizers-resolve.service';
import { EditOrganizerResolveService } from './resolves/edit-organizer-resolve.service';
import { ProfileComponent } from './components/profile/profile.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { ManageEventComponent } from './components/manage-event/manage-event.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { MyReviewsComponent } from './components/my-reviews/my-reviews.component';
import { CreateOrganizerComponent } from './components/create-organizer/create-organizer.component';
import { MyOrganizersComponent } from './components/my-organizers/my-organizers.component';
import { EditOrganizerComponent } from './components/edit-organizer/edit-organizer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EditorModule,
    ClipboardModule,
    ColorPickerModule,
    ImageUploadModule.forRoot(),
    SharedModule,
    AccountRoutingModule
  ],
  declarations: [
    CreateEventComponent,
    ProfileComponent,
    MyEventsComponent,
    EditEventComponent,
    ManageEventComponent,
    MyOrdersComponent,
    OrderDetailsComponent,
    MyReviewsComponent,
    CreateOrganizerComponent,
    MyOrganizersComponent,
    EditOrganizerComponent
  ],
  providers: [
    AccountService,
    MyEventResolveService,
    EditEventResolveService,
    MyOrdersResolveService,
    OrderDetailsResolveService,
    MyReviewsResolveService,
    MyOrganizersResolveService,
    EditOrganizerResolveService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AccountModule { }
