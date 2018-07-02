import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ImageUploadModule } from "angular2-image-upload";
import { SharedModule } from '../shared/shared.module';

import { AccountRoutingModule } from './account-routing.module';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { AccountService } from './services/account.service';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EditorModule,
    ImageUploadModule.forRoot(),
    SharedModule,
    AccountRoutingModule
  ],
  declarations: [
    CreateEventComponent,
    ProfileComponent
  ],
  providers: [AccountService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AccountModule { }
