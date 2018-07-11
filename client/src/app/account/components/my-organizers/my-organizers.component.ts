import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-organizers',
  templateUrl: './my-organizers.component.html',
  styleUrls: ['./my-organizers.component.css']
})
export class MyOrganizersComponent implements OnInit {
  preloader:boolean = true;
  myOrganizers;
  organizersToShow:boolean = false;
  flashAlert:boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private accountService: AccountService,
              public authService: AuthService) {}

  ngOnInit() {
    this.route.data
      .subscribe((res) => {
        this.myOrganizers = res.myOrganizers;

        if(!this.myOrganizers.message) {
          this.organizersToShow = true;          
        }
        
        this.preloader = false;
      }, (err) => {
         this.flashAlert = true;
          setTimeout(() => {
            this.flashMessages.show("An error occured, please refresh and try again", {cssClass: 'alert-danger', timeout: 6000});
            setTimeout(() => {
              this.flashAlert = false;
            },6000);
          }, 500);
          console.log(err);
      });
  }

  deleteOrganizer(organizerId, index) {
    let r = window.confirm('Deleting organizer... Click ok to continue');
    
    if(r) {
      this.accountService.deleteOrganizer(organizerId)
        .subscribe((res) => {
            this.myOrganizers.splice(index, 1);
            this.flashAlert = true;
            setTimeout(() => {
              this.flashMessages.show("Organizer Profile Successfully Deleted!", {cssClass: 'alert-info', timeout: 6000});
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
            console.log(err);
        });
    }
  }

}
