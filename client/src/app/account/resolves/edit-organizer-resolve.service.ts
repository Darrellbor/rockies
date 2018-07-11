import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AccountService } from '../services/account.service';

@Injectable()
export class EditOrganizerResolveService {
  url;

  constructor(private accountService: AccountService,
              private router: Router,
              private authService: AuthService) {
  }

  getOrganizerDetails() {
    return this.accountService.getOrganizerDetailsByUrl(this.url);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.url = route.params.url;
  
    return this.getOrganizerDetails();
  }

}

