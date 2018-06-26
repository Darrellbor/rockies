import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeService } from './services/home.service';
import { HomeResolveService } from './resolves/home-resolve.service';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { SearchFilterResolveService } from './resolves/search-filter-resolve.service';
import { EventResolveService } from './resolves/event-resolve.service';
import { EventComponent } from './components/event/event.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: ''
    }),
    CoreRoutingModule
  ],
  declarations: [
    HomeComponent,
    SearchFilterComponent,
    EventComponent
  ],
  providers: [
    HomeService,
    HomeResolveService,
    SearchFilterResolveService,
    EventResolveService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CoreModule { }
