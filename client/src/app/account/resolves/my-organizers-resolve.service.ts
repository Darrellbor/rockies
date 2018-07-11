import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AccountService } from '../services/account.service';

@Injectable()
export class MyOrganizersResolveService {

  constructor(private accountService: AccountService,
              private router: Router,
              private authService: AuthService) {
  }

  getMyOrganizers() {
    return this.accountService.getAllOrganizersProfiles();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  
    return this.getMyOrganizers();
  }

}

