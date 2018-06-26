import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderComponent } from '../components/preloader/preloader.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FlashMessagesModule } from 'angular2-flash-messages';

@NgModule({
  imports: [
    CommonModule,
    AngularFontAwesomeModule,
    FlashMessagesModule
  ],
  declarations: [
    PreloaderComponent
  ],
  exports: [
    PreloaderComponent,
    AngularFontAwesomeModule,
    FlashMessagesModule
  ]
})
export class SharedModule { }
