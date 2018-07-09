import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AccountService } from '../services/account.service';

@Injectable()
export class MyEventResolveService {

  constructor(private accountService: AccountService,
              private router: Router,
              private authService: AuthService) {
  }

  getMyEvents() {
    return this.accountService.getMyEvents();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  
    return this.getMyEvents();
  }

}

