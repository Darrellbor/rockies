import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { HomeService } from '../../services/home.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  eventUrl:string = "";
  preloader:boolean = true;
  flashAlert:boolean = false;
  details;
  showMap:boolean = false;
  map = {
    title: '',
    lng: 0,
    lat: 0
  };
  showTicket2:boolean = false;
  ticketCollapse1:boolean = true;
  ticketCollapse2:boolean = true;
  ticketNo1:number = 0;
  ticketNo2:number = 0;
  orderDisable:boolean = true;
  orderVisibility:boolean = true;
  reviewVisibility:boolean = false;
  showReviews:boolean = false;
  ratingScore:number = 0;
  review:string = "";
  otherEvents:boolean = false;
  otherEventsInner:boolean = false;
  moreEvents;
  contactO = {
    name: '',
    email: '',
    contactReason: '',
    message: '',
    eventName: ''
  }
  orderQuery = {
    number: 0,
    type: '',
    name: '',
    url: '',
    time: 0,
    price: 0
  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private homeService: HomeService,
              public authService: AuthService) {}

  ngOnInit() {
    this.route.params
      .subscribe((res) => {
        this.eventUrl = res.url;
      }, (err) => {
          console.log(err);
      });
    this.route.data
      .subscribe((res) => {
        this.details = res.eventDetails;
        this.getMap();
        this.showSecondTicket();
        this.decernOrderDisable();
        this.decernOrderVisibility();
        this.reviewsHandler();
        this.updateCategoryTimes();
        this.preloader = false;
        this.fetchMoreEvents(this.details.organizer._id);
      }, (err) => {
          console.log(err);
      });
  }

  getMap() {
    if(this.details.location.showMap === "Yes") {
      this.map.title = this.details.location.name;
      this.map.lng = this.details.location.coordinates[0];
      this.map.lat = this.details.location.coordinates[1];

      this.showMap = true;
    }
  }

  showSecondTicket() {
    if(this.details.ticket[1] && this.details.ticket[1] !== null) {
      this.showTicket2 = true;
    }
  }

  decernOrderDisable() {
    if(this.details.ticket[1]) {
      if(new Date(this.details.ticket[0].ticketSaleStarts) <= new Date() && new Date(this.details.ticket[0].ticketSaleEnds) >= new Date() ||
         new Date(this.details.ticket[1].ticketSaleStarts ) <= new Date() && new Date(this.details.ticket[1].ticketSaleEnds) >= new Date()) {
            this.orderDisable = false;
      }
    } else {
      if(new Date(this.details.ticket[0].ticketSaleStarts) <= new Date() && new Date(this.details.ticket[0].ticketSaleEnds) >= new Date()) {
        this.orderDisable = false;
      }
    }
  }

  decernOrderVisibility() {
    if(this.details.ticket[1]) {
      if(this.details.ticket[0].quantity < 1 && this.details.ticket[1].quantity < 1) {
        this.orderVisibility = false;
      }
    } else {
      if(this.details.ticket[0].quantity < 1) {
        this.orderVisibility = false;
      }
    } 
  }

  reviewsHandler() {
    if(new Date(this.details.endDate) <= new Date()) {
      this.reviewVisibility = true;

      if(this.details.reviews.length > 0) {
        let score = 0;
        for(var i = 0; i < this.details.reviews.length; i++) {
          score += this.details.reviews[i].sentimentRating;
        }
        this.ratingScore = (score / this.details.reviews.length) * 5;
        this.showReviews = true;
      }
    }
  }

  toggleTicket(ticket) {
    if(ticket == 0) {
      this.ticketCollapse1 = !this.ticketCollapse1;
    } else {
      this.ticketCollapse2 = !this.ticketCollapse2;
    }
  }

  minusTicketNo(ticket) {
    if(ticket == 0) {
      if(this.ticketNo1 > 0) {
        this.ticketNo1= this.ticketNo1 - 1;
      }
    } else {
      if(this.ticketNo2 > 0) {
        this.ticketNo2 = this.ticketNo2 - 1;
      }
    }
  }

  plusTicketNo(ticket) {
    if(ticket == 0) {
      if(this.ticketNo1 < this.details.ticket[0].maxTicketPerPerson) {
        this.ticketNo1 = this.ticketNo1 + 1;
      }
    } else {
      if(this.ticketNo2 < this.details.ticket[1].maxTicketPerPerson) {
        this.ticketNo2 = this.ticketNo2 + 1;
      }
    }
  }

  orderTickets() {
    if(this.ticketNo1 < 1 && this.ticketNo2 < 1) {
      this.flashAlert = true;
      setTimeout(() => {
        this.flashMessages.show("Please specity the number of tickets before buying!", {cssClass: 'alert-danger', timeout: 6000});
        setTimeout(() => {
          this.flashAlert = false;
        },6000);
      }, 500);
    } else if(this.ticketNo1 > 0 && this.ticketNo2 > 0) {
      this.flashAlert = true;
      setTimeout(() => {
        this.flashMessages.show("You cannot order two different ticket types at a time, set one to 0 and proceed", {cssClass: 'alert-danger', timeout: 6000});
        setTimeout(() => {
          this.flashAlert = false;
        },6000);
      }, 500);
    } else {
      if(this.ticketNo1 > 0) {
        this.orderQuery.name = this.details.ticket[0].name;
        this.orderQuery.number = this.ticketNo1;
        this.orderQuery.type = this.details.ticket[0].normalType;
        this.orderQuery.url = this.eventUrl;
        this.orderQuery.time = this.details.settings.reservationLimit;
        this.orderQuery.price = this.details.ticket[0].price;
      } else if(this.ticketNo2 > 0) {
        this.orderQuery.name = this.details.ticket[1].name;
        this.orderQuery.number = this.ticketNo2;
        this.orderQuery.type = this.details.ticket[1].normalType;
        this.orderQuery.url = this.eventUrl;
        this.orderQuery.time = this.details.settings.reservationLimit;
        this.orderQuery.price = this.details.ticket[1].price;
      }

      localStorage.removeItem('orderQuery');
      localStorage.setItem('orderQuery', JSON.stringify(this.orderQuery));
      this.router.navigate(['/a/order']);
    }
  }

  postReview({value, valid}) {
    if(valid) {
      this.homeService.addReview(this.eventUrl, value)
        .subscribe((res) => {
          this.flashAlert = true;
          setTimeout(() => {
            this.flashMessages.show("Review successfully posted!", {cssClass: 'alert-success', timeout: 8000});
            setTimeout(() => {
              this.flashAlert = false;
            },8000);
          }, 500);
          this.review = "Enter your review";
          this.details.reviews.unshift(res);
          this.reviewsHandler();
        }, (err) => {
          let val = JSON.parse(err._body);
          this.flashAlert = true;
          setTimeout(() => {
            this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 6000});
            setTimeout(() => {
              this.flashAlert = false;
            },6000);
          }, 500);
        });
    } else {
      this.flashAlert = true;
      setTimeout(() => {
        this.flashMessages.show('Invalid form submission!', {cssClass: 'alert-danger', timeout: 6000});
        setTimeout(() => {
          this.flashAlert = false;
        },6000);
      }, 500);
    }
  }

  fetchMoreEvents(id) {
    let dateQuery = {
                $gte: new Date((new Date().getTime() + (1 * 24 * 60 * 60 * 1000))) }
    let myQuery = {
      filter: {
          startDate: dateQuery,
          "settings.category": { "$regex": this.details.settings.category }
        }
    }
    this.homeService.nextOrganizerEvents(id)
      .subscribe((res) => {
        if(res.length === 0) {
          this.homeService.fetchEvents('api/events/search?count=8&sort=-totalViewed', myQuery)
            .subscribe((res) => {
              if(res.length > 0) {
                this.moreEvents = res;
                this.otherEvents = true;
              }
            }, (err) => {
                console.log(err);
            });
        } else {
          this.moreEvents = res;
          this.otherEvents = true;
          this.otherEventsInner = true;
        }
      }, (err) => {
        console.log(err);
      });
  }

  updateCategoryTimes() {
    if(!this.authService.notAuthorized()) {
      this.homeService.categoryTimes(this.details.settings.category)
        .subscribe((res) => {
        }, (err) => {
            console.log(err);
        });
    }
  }

  sendOMessage() {
    this.contactO.eventName = this.details.title;
    let payload = {
      "to": this.details.organizer.email,
      "subject": "Rockies Organizer - "+this.contactO.contactReason,
      "messageObj": this.contactO,
      "template": "/templates/contactOrganizer.html"
    }

    this.flashAlert = true;
    setTimeout(() => {
      this.flashMessages.show("Email Sending...", {cssClass: 'alert-info', timeout: 4000});
      setTimeout(() => {
        this.flashAlert = false;
      },4000);
    }, 500);

    this.authService.sendMail(payload)
      .subscribe((res) => {
        this.flashAlert = true;
        setTimeout(() => {
          this.flashMessages.show(res.message, {cssClass: 'alert-success', timeout: 6000});
          setTimeout(() => {
            this.flashAlert = false;
          },6000);
        }, 500);
      }, (err) => {
        let val = JSON.parse(err._body);
        this.flashAlert = true;
        setTimeout(() => {
          this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 6000});
          setTimeout(() => {
            this.flashAlert = false;
          },6000);
        }, 500);
      });
  }

  contactOrganizer({value, valid}) {
    this.sendOMessage();
    this.contactO = {
      name: '',
      email: '',
      contactReason: '',
      message: '',
      eventName: ''
    }
  }

}
