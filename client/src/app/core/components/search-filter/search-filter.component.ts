import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit {

  preloader: boolean = true;
  events;
  eventToggle: boolean = false;
  search = {
    city: '',
    cat: '',
    price: '',
    sort: '-totalViewed',
    page: 1,
    date: 'All Dates'
  }
  location_bar: boolean = false;
  locations = [];
  categories;
  categoriesToggle: boolean = false;
  controlLinks = [];
  PrevControls = {
    "page-item": true,
    "disabled": false
  }
  nextControls = {
    "page-item": true,
    "disabled": false
  }

  constructor(private router: Router, private route: ActivatedRoute, private homeService: HomeService) { }

  ngOnInit() {
    this.getCategories();
    this.route.params
      .subscribe((res) => {
        if(res.city && res.city !== "") {
          this.search.city = res.city;
        }

        if(res.cat && res.cat !== "") {
          this.search.cat = res.cat;
        }

        if(res.price && res.price !== "") {
          this.search.price = res.price;
        }

        if(res.date && res.date !== "") {
          this.search.date = res.date;
        }

        if(res.sort && res.sort !== "") {
          this.search.sort = res.sort;
        }

        if(res.page && res.page >= 1) {
          this.search.page = parseInt(res.page, 10);
        }
      }, (err) => {
          console.log(err);
      });

    this.route.data
      .subscribe((res) => {
        this.events = res.filteredEvents;

        if(this.events.length !== 0) {
          this.eventToggle = true;
        } else {
          this.eventToggle = false;
        }
        
        this.determineControls();
        this.preloader = false;

      }, (err) => {
          console.log(err);
      });
    
  }

  determineControls() {
    if(this.search.page === 1) {
      this.PrevControls = {
        "page-item": true,
        "disabled": true
      }
    }

    if(this.events.length < 10) {
      this.nextControls = {
        "page-item": true,
        "disabled": true
      }
    }

    this.controlLinks = [];
    for(var i = this.search.page; i >= 1; i--) {
      this.controlLinks.unshift(i);
    }
  }

  onPrev() {
    this.search.page -= 1;
    this.filterSearch();
  }

  onNext() {
    this.search.page += 1;
    this.filterSearch();
  }

  getCategories() {
    this.homeService.getCategories()
      .subscribe((res) => {
        this.categories = res;

        if(!res.message) {
          this.categoriesToggle = true;

          if(res.length > 30) {
            let categories = [];
            for(var i = 0; i < 30; i++) {
              categories.push(res[i]);
            }

            this.categories = categories;
          } else {
            let categories = [];
            for(var i = 0; i < res.length; i++) {
              categories.push(res[i]);
            }

            this.categories = categories;
          }

        } else {
          this.categories = res.message;
        }
        
      }, (err) => {
          console.log(err);
      });
  }

  changeSearchParams(key, value) {
    if(key === "page") {
      this.search[key] = value;
    } else {
      this.search[key] = value;
      this.search.page = 1;
    }
    this.filterSearch();
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
    this.search.page = 1;
    this.filterSearch();
  }

  exitLocationSuggest() {
    setTimeout(() => {
      this.location_bar = false;
      this.locations = [];
      this.search.page = 1;
      this.filterSearch();
    }, 1000);
  }

  filterSearch() {
    this.router.navigate(['/c/sf', this.search]);
  }

}
