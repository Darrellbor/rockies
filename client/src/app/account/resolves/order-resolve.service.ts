import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AccountService } from '../services/account.service';

@Injectable()
export class OrderResolveService {
  orderQuery = localStorage.getItem('orderQuery');
  orderParams = JSON.parse(this.orderQuery);

  constructor(private accountService: AccountService,
              private router: Router,
              private authService: AuthService) {
  }

  getEventDetails() {
    return this.accountService.getEventByLink(this.orderParams.url);
  }

  removeTickets() {
    let type;
    let payload;

    if(this.orderParams.type !== "Vip") {
      type = "Normal";
    } else {
      type = "Vip";
    }

    payload = {
      tickets: this.orderParams.number,
      type: type,
      operation: 'Sub'
    }

    this.accountService.manipulateEventTickets(this.orderParams.url, payload)
      .subscribe((res) => {
      }, (err) => {
        window.alert('An error occurred, please reload the page!');
        console.log(err);
      });

    return this.getEventDetails();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.removeTickets();
  }

}

