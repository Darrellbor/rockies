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
import { OrganizerResolveService } from './resolves/organizer-resolve.service';
import { EventComponent } from './components/event/event.component';
import { OrganizerComponent } from './components/organizer/organizer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { AccountConfirmComponent } from './components/account-confirm/account-confirm.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCPMQxvJGqj6EDiAb1Zqdjl002nogzEVfA'
    }),
    CoreRoutingModule
  ],
  declarations: [
    HomeComponent,
    SearchFilterComponent,
    EventComponent,
    OrganizerComponent,
    LoginComponent,
    RegisterComponent,
    PricingComponent,
    HowItWorksComponent,
    AccountConfirmComponent
  ],
  providers: [
    HomeService,
    HomeResolveService,
    SearchFilterResolveService,
    EventResolveService,
    OrganizerResolveService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CoreModule { }
