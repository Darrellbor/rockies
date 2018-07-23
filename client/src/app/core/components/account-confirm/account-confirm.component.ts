import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { HomeService } from '../../services/home.service';
import { AuthService } from '../../../services/auth.service';

@Component({

  selector: 'app-account-confirm',
  templateUrl: './account-confirm.component.html',
  styleUrls: ['./account-confirm.component.css']
})
export class AccountConfirmComponent implements OnInit {
  preloader:boolean = true;
  flashAlert:boolean = false;
  state;
  key;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private homeService: HomeService,
              public authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams
      .subscribe((res) => {
        this.key = res.key;
        if(this.key === undefined) {
          this.router.navigate(['/c/login']);
        } else {
          this.authService.storeUserToken(this.key);
          this.confirmAccount();
        }
        this.preloader = false;
      }, (err) => {
        this.flashAlert = true;
        setTimeout(() => {
          this.flashMessages.show("An error occured! please reload", {cssClass: 'alert-danger', timeout: 6000});
          setTimeout(() => {
            this.flashAlert = false;
          },6000);
        }, 500);
      });
  }

  confirmAccount() {
    this.homeService.confirmAccount()
      .subscribe((res) => {
        this.state = "Successful";
        localStorage.removeItem('token');
      }, (err) => {
        this.state = "Failed";
        localStorage.removeItem('token');
      });
  }

}
