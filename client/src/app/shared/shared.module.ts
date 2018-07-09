import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderComponent } from '../components/preloader/preloader.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { SearchPipe } from '../pipes/search.pipe';

@NgModule({
  imports: [
    CommonModule,
    AngularFontAwesomeModule,
    FlashMessagesModule
  ],
  declarations: [
    PreloaderComponent,
    SearchPipe
  ],
  exports: [
    PreloaderComponent,
    AngularFontAwesomeModule,
    FlashMessagesModule,
    SearchPipe
  ]
})
export class SharedModule { }
