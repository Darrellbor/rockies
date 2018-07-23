import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  preloader:boolean = true;
  flashAlert:boolean = false;
  eventData;
  orderQuery = localStorage.getItem('orderQuery');
  orderParams = JSON.parse(this.orderQuery);
  minute;
  second;
  disableOrderBtn:boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private accountService: AccountService,
              public authService: AuthService) {}

  ngOnInit() {
    this.route.data
      .subscribe((res) => {
        this.eventData = res.orderData;
        localStorage.removeItem('eventData');
        localStorage.setItem('eventData', JSON.stringify(this.eventData));
        this.preloader = false;
        this.timeAlgorithm();
      }, (err) => {
          this.flashAlert = true;
          setTimeout(() => {
            this.flashMessages.show("An error occured! please reload the page.", {cssClass: 'alert-danger', timeout: 6000});
            setTimeout(() => {
              this.flashAlert = false;
            },6000);
          }, 500);
          console.log(err);
      });
  }

  timeAlgorithm() {
    this.minute = this.orderParams.time - 1;
    this.second = 59;

    var timerInterval = setInterval(() => {
      this.second = this.second - 1;
      if(this.second < 10 && this.second > 0) {
        this.second = "0"+this.second;
      }
      if(this.second === 0) {
        this.minute = this.minute - 1;
        this.second = 59;

        if(this.minute < 0) {
          this.minute = 0;
          this.second = "00";
          clearInterval(timerInterval);
          this.disableOrderBtn = true;

          //add back the tickets
          let type;
          let payload;
          let incompleteE;

          if(this.orderParams.type !== "Vip") {
            type = "Normal";
          } else {
            type = "Vip";
          }

          payload = {
            tickets: this.orderParams.number,
            type: type,
            operation: 'Add'
          }

          this.accountService.manipulateEventTickets(this.orderParams.url, payload)
            .subscribe((res) => {
            }, (err) => {
              console.log(err);
            });

          //add incomplete event
          incompleteE = {
            type: "Incomplete Event",
            function: "Add",
            _id: this.eventData._id,
            title: this.eventData.title,
            eventLink: this.eventData.eventLink,
            exclusive: this.eventData.exclusive,
            startDate: this.eventData.startDate,
            eventImage: this.eventData.eventImage,
            category: this.eventData.settings.category,
            address: this.eventData.location.address,
            eventType: this.eventData.ticket[0].normalType,
            cost: this.eventData.ticket[0].price,
          }

          this.accountService.manipulateIncompleteEvents(incompleteE)
            .subscribe((res) => {
            }, (err) => {
              console.log(err);
            });
        }
      }
    }, 1000);
  }

  removeIncompleteE() {
    let incompleteE = {
          type: "Incomplete Event",
          function: "Remove",
          _id: this.eventData._id
        }

    this.accountService.manipulateIncompleteEvents(incompleteE)
      .subscribe((res) => {
      }, (err) => {
        console.log(err);
      });
  }

  checkForIncompleteE() {
    this.authService.getProfile()
      .subscribe((res) => {
        for(var i = 0; i < res.explore.incompleteEventOrders.length; i++) {
          if(this.eventData._id === res.explore.incompleteEventOrders[i]._id) {
            this.removeIncompleteE();
          }
        }
      }, (err) => {
        console.log(err);
      });
  }

  payForTicket() {   
    this.checkForIncompleteE();
    let myEmail = this.authService.decodedJwt().email;
    let price = this.orderParams.price * this.orderParams.number;
    let transFee = (1.5 / 100) * price;
    if(price > 2500) {
      transFee = transFee + 100;
    }
    let myPrice;
    myPrice = price + transFee;
    myPrice = myPrice + "00";
    let payload = {
      email: myEmail,
      amount: myPrice,
      subaccount: this.eventData.payout.subaccount,
      bearer: 'subaccount'
    }

    this.accountService.initializePayment(payload)
      .subscribe((res) => {
        window.location.href = res.data.authorization_url;
      }, (err) => {
        this.flashAlert = true;
        setTimeout(() => {
          this.flashMessages.show("An error occured while trying to obtain payment redirect. Please try again", {cssClass: 'alert-danger', timeout: 6000});
          setTimeout(() => {
            this.flashAlert = false;
          },6000);
        }, 500);
        console.log(err);
      });
  }

  obtainTicket() {
    this.checkForIncompleteE();
    this.router.navigate(['/a/order/confirm']);
  }

}
