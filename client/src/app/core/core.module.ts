import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeService } from './services/home.service';
import { HomeResolveService } from './resolves/home-resolve.service';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { SearchFilterResolveService } from './resolves/search-filter-resolve.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    CoreRoutingModule
  ],
  declarations: [
    HomeComponent,
    SearchFilterComponent
  ],
  providers: [
    HomeService,
    HomeResolveService,
    SearchFilterResolveService
  ]
})
export class CoreModule { }
