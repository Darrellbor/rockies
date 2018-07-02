import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { HomeService } from '../services/home.service';

@Injectable()
export class OrganizerResolveService {
  url;

  constructor(private homeService: HomeService,
              private router: Router,
              private authService: AuthService) {
  }

  getOrganizerDetails() {
    this.homeService.getOrganizerDetailsByUrl(this.url)
      .subscribe((res) => {
      }, (err) => {
        this.router.navigate(['notAvailable']);
      });
    return this.homeService.getOrganizerDetailsByUrl(this.url);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.url = route.params.url;
  
    return this.getOrganizerDetails();
  }

}

