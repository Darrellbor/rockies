import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { HomeService } from '../services/home.service';

@Injectable()
export class HomeResolveService {

  getGetLocation;
  getErrorCode;
  events = [];
  pendingEvents = [];

  constructor(private homeService: HomeService,
              private router: Router,
              private authService: AuthService) {

                //this.getLocation();
                this.determineFetchedEvents("error");
  }

  getLocation() {
    if(navigator.geolocation) {
      if (window.navigator && window.navigator.geolocation) {
          window.navigator.geolocation.getCurrentPosition(
              position => {
                this.getGetLocation = position;
                this.determineFetchedEvents(position)
              },
              error => {  
                  switch (error.code) {
                      case 1:
                          console.log('Permission Denied');
                          break;
                      case 2:
                          console.log('Position Unavailable');
                          break;
                      case 3:
                          console.log('Timeout');
                          break;
                  }

                  this.getErrorCode = error.code;
                  this.determineFetchedEvents("error");
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
              }
          );
      }
    } else {
      this.determineFetchedEvents("error");
    }
  }

  determineFetchedEvents(position) {
    if(position !== "error") {
      let eventFilter = {
        filter: {
          startDate: {
                $gte: new Date((new Date().getTime() + (-1 * 24 * 60 * 60 * 1000))),
                $lte: new Date((new Date().getTime() + (14 * 24 * 60 * 60 * 1000))) 
          },
          status: "Live"
        }
      }

      this.homeService.fetchEvents('api/events/search?count=6&sort=-totalViewed', eventFilter)
        .subscribe((res) => {
          if(res.length !== 0) {
            this.events.push(res);
          }

          this.homeService.fetchEvents('api/events/search?lng='+position.coords.longitude+'&lat='+position.coords.latitude, eventFilter)
            .subscribe((res) => {
              if(res !== null) {
                for(var i = 0; i < this.events.length; i++) {
                  for(var k = 0; k < this.events[i].length; k++) {
                    for(var j = 0; j < res.length; j++) {
                        if(this.events[i][k]._id !== res[j]._id) {
                          this.pendingEvents.push(res[j]);
                        }
                    }
                  }
                }
              }

              if(this.pendingEvents.length !== 0) {
                this.events.push(this.pendingEvents);
              } else {
                this.events.push({'message': "empty"});
              }

              if(this.events.length === 0) {
                this.events.push({'message': "empty"});
              }

              this.getIncompleteEvents();
              
            }, (err) => {
              console.log(err);
            });

        }, (err) => {
          console.log(err);
        });
    } else {
      let eventFilter = {
        filter: {
          startDate: {
                $gte: new Date((new Date().getTime() + (-1 * 24 * 60 * 60 * 1000))),
                $lte: new Date((new Date().getTime() + (14 * 24 * 60 * 60 * 1000))) 
          },
          status: "Live"
        }
      }

      let eventFilter2 = {
        filter: {
          startDate: {
                $gte: new Date((new Date().getTime() + (15 * 24 * 60 * 60 * 1000))),
                $lte: new Date((new Date().getTime() + (31 * 24 * 60 * 60 * 1000))) 
          },
          status: "Live"
        }
      }

      this.homeService.fetchEvents('api/events/search?count=6&sort=-totalViewed', eventFilter)
        .subscribe((res) => {
          if(res.length !== 0) {
            this.events.push(res);
          }

          this.homeService.fetchEvents('api/events/search?count=6&sort=-totalViewed', eventFilter2)
            .subscribe((res) => {
              if(res !== null) {
                for(var j = 0; j < res.length; j++) {
                  // for(var i = 0; i < this.events.length; i++) {
                  //   for(var k = 0; k < this.events[i].length; k++) {
                  //       if(res[j]._id !== this.events[i][k]._id) {
                          this.pendingEvents.push(res[j]);
                  //       }
                  //   }
                  // }
                }                
              }

              if(this.pendingEvents.length !== 0) {
                this.events.push(this.pendingEvents);
              } else {
                this.events.push({'message': "empty"});
              }

              if(this.events.length === 0) {
                this.events.push({'message': "empty"});
              }

              this.getIncompleteEvents();
              
            }, (err) => {
              console.log(err);
            });

        }, (err) => {
          console.log(err);
        });

    }
  }

  getIncompleteEvents() {
    let incompleteEvents = [];
    
    if(!this.authService.notAuthorized()) {
      this.authService.getProfile()
        .subscribe((res) => {
          if(res.explore.incompleteEventOrders.length !== 0) {
            for(var i = 0; i < res.explore.incompleteEventOrders.length; i++) {
              incompleteEvents.push(res.explore.incompleteEventOrders[i]);
            }

            this.events.push({'incompleteEvents': incompleteEvents});
            this.getCategories();
          } else {
            this.events.push({'incompleteEvents': "empty"});
            this.getCategories();
          }
        }, (err) => {
          console.log(err.statusText);
          this.getCategories();
        });
    } else {
      this.events.push({'incompleteEvents': "empty"});
      this.getCategories();
    }
  }

   getCategories() {
    let categories = [];
    let eventFilter = {
      filter: {}
    }
    
    if(!this.authService.notAuthorized()) {
      this.authService.getProfile()
        .subscribe((res) => {          
          if(res.explore.categories.length !== 0) {
            res.explore.categories.sort(function(a, b){return b-a});
            if(res.explore.categories.length < 6) {
              for(var i = 0; i < res.explore.categories.length; i++) {
                categories.push(res.explore.categories[i].name);
              }
            } else {
              for(var i = 0; i < 6; i++) {
                categories.push(res.explore.categories[i].name);
              }
            }

            this.events.push({'categories': categories});
          } else {
            this.homeService.fetchEvents('api/events/search?count=6&sort=-totalViewed', eventFilter)
              .subscribe((res) => {
                if(res !== null) {
                  for(var i = 0; i < res.length; i++) {
                    if(categories.length === 0) {
                      categories.push(res[i].settings.category);
                    } else {
                      for(var j = 0; j < categories.length; j++) {
                        if(res[i].settings.category !== categories[j]) {
                          categories.push(res[i].settings.category);
                        }
                      }
                    }
                  }
                }

                if(categories.length === 0) {
                  this.events.push({'categories': "empty"});
                } else {
                  this.events.push({'categories': categories});
                }
                
              }, (err) => {
                console.log(err);
              });
          }
        }, (err) => {
          console.log(err.statusText);

          this.homeService.fetchEvents('api/events/search?count=6&sort=-totalViewed', eventFilter)
            .subscribe((res) => {
              if(res !== null) {
                for(var i = 0; i < res.length; i++) {
                  if(categories.length === 0) {
                    categories.push(res[i].settings.category);
                  } else {
                    for(var j = 0; j < categories.length; j++) {
                      if(res[i].settings.category !== categories[j]) {
                        categories.push(res[i].settings.category);
                      }
                    }
                  }
                }
              }

              if(categories.length === 0) {
                this.events.push({'categories': "empty"});
              } else {
                this.events.push({'categories': categories});
              }
              
            }, (err) => {
              console.log(err);
            });
        });
    } else {
        this.homeService.fetchEvents('api/events/search?count=6&sort=-totalViewed', eventFilter)
          .subscribe((res) => {
            if(res !== null) {
              for(var i = 0; i < res.length; i++) {
                if(categories.length === 0) {
                  categories.push(res[i].settings.category);
                } else {
                  for(var j = 0; j < categories.length; j++) {
                    if(res[i].settings.category !== categories[j]) {
                      categories.push(res[i].settings.category);
                    }
                  }
                }
              }
            }

            if(categories.length === 0) {
              this.events.push({'categories': "empty"});
            } else {
              this.events.push({'categories': categories});
            }
            
          }, (err) => {
            console.log(err);
          });
    }
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.events;
  }

}
