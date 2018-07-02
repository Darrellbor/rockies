import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css']
})
export class OrganizerComponent implements OnInit {
  preloader:boolean = true;
  organizer;
  profile;
  eControls:string = "live";
  liveEvents:boolean = false;
  pastEvents:boolean = false;;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private homeService: HomeService,
              public authService: AuthService) {}

  ngOnInit() {
    this.route.data
      .subscribe((res) => {
        this.organizer = res.organizerDetails;
        this.profile = this.organizer.profile[0];
        this.checkEventAvailability();
        this.preloader = false;
      }, (err) => {
          console.log(err);
      });
  }

  eControlsChange() {
    this.eControls === "live" ? this.eControls = "past" : this.eControls = "live";
  }

  checkEventAvailability() {
    if(!this.organizer.recentEvents.message) {
      this.liveEvents = true;
    }

    if(!this.organizer.pastEvents.message) {
      this.pastEvents = true;
    }
  }

}
