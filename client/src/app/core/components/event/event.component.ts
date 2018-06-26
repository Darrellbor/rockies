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
    emali: '',
    contactReason: '',
    message: ''
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
        this.preloader = false;
        this.fetchMoreEvents(this.details.organizer._id);
        console.log(this.details);
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
    if(this.details.ticket[1]) {
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
      window.alert("Please specity the number of tickets before buying!");
    }
  }

  postReview({value, valid}) {
    if(valid) {
      this.homeService.addReview(this.eventUrl, value)
        .subscribe((res) => {
          this.flashMessages.show('Review successfully posted!', {cssClass: 'alert-success', timeout: 8000});
          this.review = "Enter your review";
          this.details.reviews.unshift(res);
          this.reviewsHandler();
        }, (err) => {
          let val = JSON.parse(err._body);
          this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 6000});
        });
    } else {
      this.flashMessages.show('Invalid form submission!', {cssClass: 'alert-danger', timeout: 5000});
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
          this.homeService.fetchEvents('api/events/search?count=10&sort=-totalViewed', myQuery)
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

  contactOrganizer({value, valid}) {

  }

}
