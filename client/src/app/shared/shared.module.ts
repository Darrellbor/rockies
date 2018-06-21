import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderComponent } from '../components/preloader/preloader.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  imports: [
    CommonModule,
    AngularFontAwesomeModule
  ],
  declarations: [
    PreloaderComponent
  ],
  exports: [
    PreloaderComponent,
    AngularFontAwesomeModule
  ]
})
export class SharedModule { }
