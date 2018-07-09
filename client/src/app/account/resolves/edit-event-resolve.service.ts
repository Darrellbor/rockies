import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AccountService } from '../services/account.service';

@Injectable()
export class EditEventResolveService {
  id;

  constructor(private accountService: AccountService,
              private router: Router,
              private authService: AuthService) {
  }

  getEventDetails() {
    return this.accountService.getEventDetailsByLink(this.id);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.id = route.params.id;
  
    return this.getEventDetails();
  }

}

