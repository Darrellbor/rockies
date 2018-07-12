import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-order-verify',
  templateUrl: './order-verify.component.html',
  styleUrls: ['./order-verify.component.css']
})
export class OrderVerifyComponent implements OnInit {
  preloader:boolean = true;
  flashAlert:boolean = false;
  orderQuery = localStorage.getItem('orderQuery');
  orderParams = JSON.parse(this.orderQuery);
  reference;
  state;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private accountService: AccountService,
              public authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams
      .subscribe((res) => {
        this.reference = res.reference;

        if(this.reference !== undefined) {
          this.verifyTrans();
        } else {
          this.state = "Successful";
          this.reference = 'None';
          this.recordOrder();
        }
        
        this.preloader = false;
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

  redirectToEvent() {
    this.router.navigate(['/c/e', this.orderParams.url]);
  }

  verifyTrans() {
    this.accountService.verifyTrans(this.reference)
      .subscribe((res) => {
        if(res.data.status === "success") {
          this.state = "Successful";
          this.recordOrder();
        } else {
          this.state = "Failed";
        }
      }, (err) => {
        this.flashAlert = true;
        setTimeout(() => {
          this.flashMessages.show("An error occured trying to verify your transaction, please try again", {cssClass: 'alert-danger', timeout: 6000});
          setTimeout(() => {
            this.flashAlert = false;
          },6000);
        }, 500);
        console.log(err);
      });
  }

  recordOrder() {
    let ticketType;
    if(this.orderParams.type !== "Vip") {
      ticketType = "Normal";
    } else {
      ticketType = "Vip";
    }

    let payload = {
      ticketName: this.orderParams.name,
      ticketType: ticketType,
      normalType: this.orderParams.type,
      status: 'Booked',
      noOfSeats: this.orderParams.number,
      cost: this.orderParams.price,
      transactionId: this.reference
    }

    this.accountService.recordOrder(this.orderParams.url, payload)
      .subscribe((res) => {
        this.flashAlert = true;
        setTimeout(() => {
          this.flashMessages.show("Order recorded Successfully!", {cssClass: 'alert-success', timeout: 6000});
          setTimeout(() => {
            this.flashAlert = false;
          },6000);
        }, 500);
      }, (err) => {
        this.flashAlert = true;
        setTimeout(() => {
          this.flashMessages.show("An error occured trying to record your order, please reload the page", {cssClass: 'alert-danger', timeout: 6000});
          setTimeout(() => {
            this.flashAlert = false;
          },6000);
        }, 500);
        console.log(err);
      });

    this.sendTicketMail();
  }

  sendTicketMail() {
    //delete localStorage orderQuery here
  }

}
