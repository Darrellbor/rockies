import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  preloader:boolean = true;
  orderDetails;
  order;
  orderToShow:boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private accountService: AccountService,
              public authService: AuthService) {}

  ngOnInit() {
    this.route.data
      .subscribe((res) => {
        this.orderDetails = res.orderDetails;

        if(!this.orderDetails.message) {
          this.orderToShow = true;          
        }
        this.order = this.orderDetails.orders[0];
        
        this.preloader = false;
      }, (err) => {
        window.alert('An error occured, please refresh and try again');
        console.log(err);
      });
  }

}
