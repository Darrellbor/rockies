import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ImageUploadModule } from "angular2-image-upload";
import { SharedModule } from '../shared/shared.module';

import { AccountRoutingModule } from './account-routing.module';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { AccountService } from './services/account.service';
import { MyEventResolveService } from './resolves/my-event-resolve.service';
import { EditEventResolveService } from './resolves/edit-event-resolve.service';
import { ProfileComponent } from './components/profile/profile.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { ManageEventComponent } from './components/manage-event/manage-event.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EditorModule,
    ClipboardModule,
    ImageUploadModule.forRoot(),
    SharedModule,
    AccountRoutingModule
  ],
  declarations: [
    CreateEventComponent,
    ProfileComponent,
    MyEventsComponent,
    EditEventComponent,
    ManageEventComponent
  ],
  providers: [
    AccountService,
    MyEventResolveService,
    EditEventResolveService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AccountModule { }
