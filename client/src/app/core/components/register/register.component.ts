import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { HomeService } from '../../services/home.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  preloader:boolean = true;
  resendE:boolean = false;
  user = {
    name: {
      first: '',
      last: ''
    },
    email: '',
    password: ''
  }
  key;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private homeService: HomeService,
              public authService: AuthService) {}

  ngOnInit() {
    this.preloader = false;
  }

  resendConfirm() {
    let payload = {
      "to": this.user.email,
      "subject": "Account Confirmation",
      "messageObj": {
        name: this.user.name.first
      },
      "template": "/templates/confirm.html"
    }

    this.sendWelcome();
    this.flashMessages.show("Email Sending...", {cssClass: 'alert-info', timeout: 7000});

    this.authService.sendMail(payload)
      .subscribe((res) => {
        this.flashMessages.show(res.message, {cssClass: 'alert-success', timeout: 6000});
      }, (err) => {
        let val = JSON.parse(err._body);
        this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 6000});
      });
  }

  sendConfirm() {
    let payload = {
      "to": this.user.email,
      "subject": "Account Confirmation",
      "messageObj": {
        name: this.user.name.first,
        key: this.key
      },
      "template": "/templates/confirm.html"
    }

    this.sendWelcome();

    this.authService.sendMail(payload)
      .subscribe((res) => {
        this.flashMessages.show(res.message, {cssClass: 'alert-success', timeout: 6000});
      }, (err) => {
        let val = JSON.parse(err._body);
        this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 6000});
      });
  }

  sendWelcome() {
    let payload = {
      "to": this.user.email,
      "subject": "Welcome To Rockies 🎉",
      "messageObj": {},
      "template": "/templates/welcome.html"
    }

    this.authService.sendMail(payload)
      .subscribe((res) => {
      }, (err) => {
        let val = JSON.parse(err._body);
        this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 6000});
      });
  }

  registerUser({value, valid}) {
    if(valid) {
      value["name"] = {
        first: value.first,
        last: value.last
      }
      delete value.first;
      delete value.last;
      
      this.authService.registerUser(value)
        .subscribe((res) => {
          this.key = res.token;
          this.flashMessages.show("Account Successfully created, confirmation email would be sent within minutes, confirm your account before logging in", {cssClass: 'alert-success', timeout: 7000});
          this.sendConfirm();
          setTimeout(() => {
            this.resendE = true;
          }, 6000);
        }, (err) => {
          let val = JSON.parse(err._body);
          this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 6000});
        });
    } else {
      this.flashMessages.show('Invalid form submission!', {cssClass: 'alert-danger', timeout: 5000});
    }
  }

}
