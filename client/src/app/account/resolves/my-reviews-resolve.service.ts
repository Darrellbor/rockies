import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AccountService } from '../services/account.service';

@Injectable()
export class MyReviewsResolveService {

  constructor(private accountService: AccountService,
              private router: Router,
              private authService: AuthService) {
  }

  getMyReviews() {
    return this.accountService.getReviews();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  
    return this.getMyReviews();
  }

}

