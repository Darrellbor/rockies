import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { HomeService } from '../../services/home.service';
import { AuthService } from '../../../services/auth.service';
import { AuthGuard } from '../../../guards/auth.guard';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  preloader:boolean = true;
  previousUrl;
  user = {
    email: '',
    password: ''
  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private homeService: HomeService,
              public authService: AuthService,
              private authGuard: AuthGuard) {}

  ngOnInit() {
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip(); 
    });

    if(this.authGuard.redirectUrl) {
      this.flashMessages.show("You must be logged in to view that page", {cssClass: 'alert-danger', timeout: 6000});
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.preloader = false;
  }

  forgotPassword() {
    this.homeService.forgetPassword(this.user.email)
      .subscribe((res) => {
        this.flashMessages.show("Your password has been reset and sent to your email.", {cssClass: 'alert-success', timeout: 7000});
      }, (err) => {
          let val = JSON.parse(err._body);
          this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 6000});
      });
  }

  loginUser({value, valid}) {
    if(valid) {
      console.log(value);
      
      this.authService.loginUser(value)
        .subscribe((res) => {
          this.authService.storeUserToken(res.token);
          this.flashMessages.show("Login Successful", {cssClass: 'alert-success', timeout: 2000});
          setTimeout(() => {
            if(this.previousUrl) {
              this.router.navigate([this.previousUrl]);
            } else {
              this.router.navigate(['/a/create-event']);
            }
          }, 2000);
        }, (err) => {
          let val = JSON.parse(err._body);
          this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 6000});
        });
    } else {
      this.flashMessages.show('Invalid form submission!', {cssClass: 'alert-danger', timeout: 5000});
    }
  }

}
