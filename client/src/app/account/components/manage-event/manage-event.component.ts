import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.css']
})
export class ManageEventComponent implements OnInit {
  id;
  preloader:boolean = true;
  eventLinks:string = "General";
  myEvent;
  totalAmount = 0;
  eventLink = "";
  copyLink = "";
  linkAlert:boolean = false;
  linkResMsg;
  linkResColor;
  orderVisibility:boolean = false;
  orderNo = 0;
  isOrderVisible = false;
  reviewVisibility:boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private accountService: AccountService,
              public authService: AuthService) {}

  ngOnInit() {
    this.route.params
      .subscribe((res) => {
        this.id = res.id;
      }, (err) => {
        window.alert('An error occured, please refresh and try again');
        console.log(err);
      });

    this.route.data
      .subscribe((res) => {
        this.myEvent = res.eventDetails;
        this.obtainAmountForTickets();
        this.eventLink = this.myEvent.eventLink;
        this.copyLink = "https://rockies.ng/#/c/e/" + this.eventLink;
        this.checkOrderReviewVisible();
        this.preloader = false;
      }, (err) => {
        window.alert('An error occured, please refresh and try again');
        console.log(err);
      });
  }

  checkOrderReviewVisible() {
    if(this.myEvent.orders.length > 0) {
      this.orderVisibility = true;
    }

    if(this.myEvent.reviews.length > 0) {
      this.reviewVisibility = true;
    }
  }

  obtainAmountForTickets() {
    let fee;
    for(var i = 0; i < this.myEvent.orders.length; i++) {
      this.totalAmount += this.myEvent.orders[i].cost;
    }

    fee = (5 / 100) * this.totalAmount;
    this.totalAmount = this.totalAmount - fee;
  }

  changeEventLinks(link) {
    this.eventLinks = link;
  }

  copyToClipboard() {
    this.linkAlert = true;
    setTimeout(() => {
      this.flashMessages.show('Event link successfully copied to clipboard', {cssClass: 'alert-info', timeout: 4000});
      setTimeout(() => {
        this.linkAlert = false;
      },4000);
    }, 500);
  }

  checkAvailability() {
    this.accountService.checkAvailability(this.eventLink)
      .subscribe((res) => {
        if(res === null) {
          this.linkResMsg = "hurray, the event link is available!";
          this.linkResColor = "Available";
        } else {
          this.linkResMsg = "Oops, the event link is not available!";
          this.linkResColor = "Taken";
        }
        
      }, (err) => {
        window.alert('An error occured, please refresh and try again');
        console.log(err);
      });
  }

  updateLink() {
    if(this.linkResColor === "Available") {
      this.myEvent.eventLink = this.eventLink;
      this.copyLink = "https://rockies.ng/#/c/e/" + this.eventLink;

      this.accountService.editEvent(this.id, this.myEvent)
        .subscribe((res) => {
          this.linkAlert = true;
          setTimeout(() => {
            this.flashMessages.show('Event Link Successfully Updated', {cssClass: 'alert-success', timeout: 6000});
            setTimeout(() => {
              this.linkAlert = false;
            },6000);
          }, 500);
        }, (err) => {
          this.linkAlert = true;
          setTimeout(() => {
            this.flashMessages.show('An error occured trying to update event link, please try again!', {cssClass: 'alert-danger', timeout: 6000});
            setTimeout(() => {
              this.linkAlert = false;
            },6000);
          }, 500);
        });
    } else {
      this.linkAlert = true;
      setTimeout(() => {
        this.flashMessages.show('Input a link that is available before updating', {cssClass: 'alert-danger', timeout: 6000});
        setTimeout(() => {
          this.linkAlert = false;
        },6000);
      }, 500);
    }
  }

  changeOrderVisibility(index) {
    this.orderNo = index;
    this.isOrderVisible === false ? this.isOrderVisible = true : this.isOrderVisible = false;
  }

}
