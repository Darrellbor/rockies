import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AccountService } from '../services/account.service';

@Injectable()
export class OrderDetailsResolveService {
  eventId;
  orderId;

  constructor(private accountService: AccountService,
              private router: Router,
              private authService: AuthService) {
  }

  getOrderDetails() {
    this.accountService.getOrderByIds(this.eventId, this.orderId)
    .subscribe((res) => {
    }, (err) => {
      this.router.navigate(['notAvailable']);
    });
    return this.accountService.getOrderByIds(this.eventId, this.orderId);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.eventId = route.params.eventId;
    this.orderId = route.params.orderId;
  
    return this.getOrderDetails();
  }

}

