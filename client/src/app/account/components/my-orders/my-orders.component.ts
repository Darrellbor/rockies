import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  preloader:boolean = true;
  myOrders;
  ordersToShow:boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private accountService: AccountService,
              public authService: AuthService) {}

  ngOnInit() {
    this.route.data
      .subscribe((res) => {
        this.myOrders = res.myOrders;

        if(!this.myOrders.message) {
          this.ordersToShow = true;          
        }
        
        this.preloader = false;
      }, (err) => {
        window.alert('An error occured, please refresh and try again');
        console.log(err);
      });
  }

}
