import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { HomeService } from '../services/home.service';

@Injectable()
export class EventResolveService {
  url;

  constructor(private homeService: HomeService,
              private router: Router,
              private authService: AuthService) {
  }

  getEventDetails() {
    this.homeService.getEventDetailsByLink(this.url)
      .subscribe((res) => {
        if(res === null) {
          this.router.navigate(['notAvailable']);
        }
      }, (err) => {
          console.log(err);          
          this.router.navigate(['notAvailable']);
      });

    return this.homeService.getEventDetailsByLink(this.url);
  }

  updateTotalViewed() {
    this.homeService.updateTotalViewed(this.url)
      .subscribe((res) => {
      }, (err) => {
          console.log(err);          
          this.router.navigate(['notAvailable']);
      });

     return this.getEventDetails();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.url = route.params.url;
  
    return this.updateTotalViewed();
  }

}
