import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  events;
  eventShow: boolean = false;
  eventShowSet2: boolean = false;
  ie_index: number = 2;
  ie_visibility: boolean = false;
  cat_index: number = 3;
  cat_visibility: boolean = false;
  location_bar: boolean = false;
  locations = [];
  search = {
    catTitle: '',
    city: '',
    date: 'All Dates'
  }

  constructor(private router: Router, private route: ActivatedRoute, private homeService: HomeService) { }

  ngOnInit() {
    this.route.data
      .subscribe((res) => {
        this.events = res.recommendedEvents;

        setTimeout(() => {
          if(!this.events[0].message) {
            this.eventShow = true;
          } 

          if(!this.events[1].message) {
            this.eventShowSet2 = true;
          }

          if(this.events[1].incompleteEvents) {
            this.ie_index = 1;
          }

          if(this.events[this.ie_index].incompleteEvents !== "empty") {
            this.ie_visibility = true;
          }

          if(this.events[2].categories) {
            this.cat_index = 2;
          }

          if(this.events[this.cat_index].categories !== "empty") {
            this.cat_visibility = true;
          }
          console.log(this.events);
          
        }, 3000);
        
      }, (err) => {
        console.log(err);
      });
  }

  searchLocations() {
    this.locations = [];
    
    if(this.search.city === "") {
      this.location_bar = false
    } else {
      this.homeService.getLocations('api/locations?city='+this.search.city)
        .subscribe((res) => {
          for(var i = 0; i < res.length; i++) {
            this.locations.push({state: res[i].states[0], country: res[i].country});
          }

          if(this.locations.length === 0) {
            this.location_bar = false;
          } else {
            this.location_bar = true;
          }
        }, (err) => {
          console.log(err);
        });
    }
  }

  setLocationBar(state, country) {    
    this.search.city = state+","+country;
    this.location_bar = false;
    this.locations = [];
  }

  exitLocationSuggest() {
    setTimeout(() => {
      this.location_bar = false;
      this.locations = [];
    }, 1000);
  }

  searchEvents({value, valid}) {}

}
