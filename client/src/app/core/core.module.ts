import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './components/home/home.component';
import { HomeService } from './services/home.service';
import { HomeResolveService } from './resolves/home-resolve.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularFontAwesomeModule,
    CoreRoutingModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    HomeService,
    HomeResolveService
  ]
})
export class CoreModule { }
