import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { HomeService } from '../services/home.service';

@Injectable()
export class SearchFilterResolveService {
  query;
  dateQuery;
  myQuery;
  city;
  sort = "-totalViewed";
  page = 0;
  events;

  constructor(private homeService: HomeService,
              private router: Router,
              private authService: AuthService) {
  }

  decernDate() {
    if(this.query.sort && this.query.sort !== "") {
      this.sort = this.query.sort;
    }

    if(this.query.page) {
      this.page = (this.query.page - 1) * 10;
    }

    if(this.query.date) {
      switch(this.query.date) {
        case 'All Dates':
          this.dateQuery = {  $gte: new Date((new Date().getTime() + (-1 * 24 * 60 * 60 * 1000))) }
          break;

        case 'Today':
          this.dateQuery = { 
                $gte: new Date((new Date().getTime() + (0 * 24 * 60 * 60 * 1000))),
                $lte: new Date((new Date().getTime() + (1 * 24 * 60 * 60 * 1000))) 
          }
          break;

        case 'Tomorrow':
          this.dateQuery = { 
                $gte: new Date((new Date().getTime() + (1 * 24 * 60 * 60 * 1000))),
                $lte: new Date((new Date().getTime() + (2 * 24 * 60 * 60 * 1000)))   
          }
          break;

        case 'This Week':
          this.dateQuery = { 
                $gte: new Date((new Date().getTime() + (-1 * 24 * 60 * 60 * 1000))),
                $lte: new Date((new Date().getTime() + (7 * 24 * 60 * 60 * 1000))) 
          }
          break;

        case 'This Weekend':
          this.dateQuery = {
                $gte: new Date((new Date().getTime() + (-1 * 24 * 60 * 60 * 1000))),
                $lte: new Date((new Date().getTime() + (5 * 24 * 60 * 60 * 1000))) 
          }
          break;

        case 'This Month':
          this.dateQuery = {
                $gte: new Date((new Date().getTime() + (-1 * 24 * 60 * 60 * 1000))),
                $lte: new Date((new Date().getTime() + (31 * 24 * 60 * 60 * 1000))) 
          }
          break;

        case 'Next Month':
          this.dateQuery = {
                $gte: new Date((new Date().getTime() + (14 * 24 * 60 * 60 * 1000))),
                $lte: new Date((new Date().getTime() + (31 * 24 * 60 * 60 * 1000))) 
          }
          break;

        default:
          this.dateQuery = {
                $gte: new Date((new Date().getTime() + (-1 * 24 * 60 * 60 * 1000))) }
      }
      
      return this.fetchEvents();
    } else { 
      this.dateQuery = {
                $gte: new Date((new Date().getTime() + (-1 * 24 * 60 * 60 * 1000))) }

      return this.fetchEvents();
    }
  }

  fetchEvents() {
    if((this.query.catTitle && this.query.price && this.query.cat && this.query.city && this.query.date) && (this.query.catTitle !== "" && (this.query.price !== "" && this.query.price !== "All Prices") && (this.query.cat !== "" && this.query.cat !== "All Categories") && this.query.city !== "" && this.query.date !== "")) {
      this.city = this.query.city.split(",");
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          $or: [ { title: { "$regex": this.query.catTitle } }, { "settings.category": { "$regex": this.query.catTitle } } ],
          "settings.category": { "$regex": this.query.cat },
          "ticket.normalType": this.query.price,
          "location.address.state": { "$regex": this.city[0] },
          status: "Live"
        }
      }
    } else if((this.query.catTitle && this.query.cat && this.query.city && this.query.date) && (this.query.catTitle !== "" && (this.query.cat !== "" && this.query.cat !== "All Categories") && this.query.city !== "" && this.query.date !== "")) {
      this.city = this.query.city.split(",");
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          $or: [ { title: { "$regex": this.query.catTitle } }, { "settings.category": { "$regex": this.query.catTitle } } ],
          "settings.category": { "$regex": this.query.cat },
          "location.address.state": { "$regex": this.city[0] },
          status: "Live"
        }
      }
    } else if((this.query.price && this.query.cat && this.query.city && this.query.date) && ((this.query.price !== "" && this.query.price !== "All Prices") && (this.query.cat !== "" && this.query.cat !== "All Categories") && this.query.city !== "" && this.query.date !== "")) {
      this.city = this.query.city.split(",");
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          "settings.category": { "$regex": this.query.cat },
          "ticket.normalType": this.query.price,
          "location.address.state": { "$regex": this.city[0] },
          status: "Live"
        }
      }
    } else if((this.query.cat && this.query.city && this.query.date) && ((this.query.cat !== "" && this.query.cat !== "All Categories") && this.query.city !== "" && this.query.date !== "")) {
      this.city = this.query.city.split(",");
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          "settings.category": { "$regex": this.query.cat },
          "location.address.state": { "$regex": this.city[0] },
          status: "Live"
        }
      }
    } else if((this.query.price && this.query.cat && this.query.date) && ((this.query.price !== "" && this.query.price !== "All Prices") && (this.query.cat !== "" && this.query.cat !== "All Categories") && this.query.date !== "")) {
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          "settings.category": { "$regex": this.query.cat },
          "ticket.normalType": this.query.price,
          status: "Live"
        }
      }
    } else if((this.query.price && this.query.city && this.query.date) && ((this.query.price !== "" && this.query.price !== "All Prices") && this.query.city !== "" && this.query.date !== "")) {
      this.city = this.query.city.split(",");
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          "ticket.normalType": this.query.price,
          "location.address.state": { "$regex": this.city[0] },
          status: "Live"
        }
      }
    } else if((this.query.catTitle && this.query.city && this.query.date) && (this.query.catTitle !== "" && this.query.city !== "" && this.query.date !== "")) {
      this.city = this.query.city.split(",");
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          $or: [ { title: { "$regex": this.query.catTitle } }, { "settings.category": { "$regex": this.query.catTitle } } ],
          "location.address.state": { "$regex": this.city[0] },
          status: "Live"
        }
      }
    } else if((this.query.cat && this.query.date) && ((this.query.cat !== "" && this.query.cat !== "All Categories") && this.query.date !== "")) {
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          "settings.category": { "$regex": this.query.cat },
          status: "Live"
        }
      }
    } else if((this.query.price && this.query.date) && ((this.query.price !== "" && this.query.price !== "All Prices") && this.query.date !== "")) {
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          "ticket.normalType": this.query.price,
          status: "Live"
        }
      }
    } else if((this.query.catTitle && this.query.date) && (this.query.catTitle !== "" && this.query.date !== "" && this.query.date !== "All Dates")) {
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          $or: [ { title: { "$regex": this.query.catTitle } }, { "settings.category": { "$regex": this.query.catTitle } } ],
          status: "Live"
        }
      }
    } else if((this.query.city && this.query.date) && (this.query.city !== "" && this.query.date !== "")) {
      this.city = this.query.city.split(",");
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          "location.address.state": { "$regex": this.city[0] },
          status: "Live"
        }
      }
    } else if((this.query.cat) && ((this.query.cat !== "" && this.query.cat !== "All Categories"))) {
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          "settings.category": { "$regex": this.query.cat },
          status: "Live"
        }
      }
    } else {
      this.myQuery = {
        filter: {
          startDate: this.dateQuery,
          status: "Live"
        }
      }
    }

    return this.homeService.fetchEvents('api/events/search?count=10&offset='+this.page+'&sort='+this.sort, this.myQuery);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.query = route.params;
    
    return this.decernDate();
  }

}
