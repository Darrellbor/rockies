import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../services/auth.service';

declare var $: any;

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  preloader:boolean = true;
  filterBar:string = "";
  myEvents;
  eventsToShow:boolean = false;
  linkActive = "Live";
  events = {
    live: [],
    saved: [],
    past: []
  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private accountService: AccountService,
              public authService: AuthService) {}

  ngOnInit() {
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip(); 
    });

    this.route.data
      .subscribe((res) => {
        this.myEvents = res.myEvents;

        if(!this.myEvents.message) {
          this.buildEvents();
          this.eventsToShow = true;          
        }
        
        this.preloader = false;
      }, (err) => {
        window.alert('An error occured, please refresh and try again');
        console.log(err);
      });
  }

  buildEvents() {
    for(var i = 0; i < this.myEvents.length; i++) {
      if(this.myEvents[i].status === "Live" && new Date(this.myEvents[i].endDate) >= new Date() ) {
        this.events.live.push(this.myEvents[i]);
      } else if(new Date(this.myEvents[i].endDate) < new Date()) {
        this.events.past.push(this.myEvents[i]);
      } else if(this.myEvents[i].status === "Saved") {
        this.events.saved.push(this.myEvents[i]);
      }
    }
    
  }

  changeLinkActive(link) {
    this.linkActive = link;
  }

  removeEvents(id, index, link) {
    var r = window.confirm('Deleting event, click ok to continue.');

    if(r) {
      this.linkActive = "None";
      this.accountService.removeEvent(id)
        .subscribe((res) => {
          this.flashMessages.show("Event Successfully Deleted", {cssClass: 'alert-secondary', timeout: 6000});

          setTimeout(() => {
            if(link === "Live") {
              this.events.live.splice(index, 1);
              this.linkActive = "Live";
            } else if(link === "Saved") {
              this.events.saved.splice(index, 1);
              this.linkActive = "Saved";           
            } else if(link === "Past") {
              this.events.past.splice(index, 1);
              this.linkActive = "Past"; 
            }
          }, 200);
          
        }, (err) => {
          let val = JSON.parse(err._body);
          this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 5000});
        });
    }
  }

  turnEventLive(link, index) {
    var r = window.confirm('You are about going live... Click ok to continue');

    if(r) {
      this.linkActive = "None";
      this.accountService.makeEventLive(link)
        .subscribe((res) => {
          this.flashMessages.show("Your Event has successfully gone live", {cssClass: 'alert-success', timeout: 6000});
          setTimeout(() => {
            this.events.live.unshift(this.events.saved[index]);
            this.events.saved.splice(index, 1);
            this.linkActive = "Saved";            
          }, 200);
        }, (err) => {
           let val = JSON.parse(err._body);
          this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 5000});
        });
    }
  }

}
