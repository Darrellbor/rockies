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
  user = {
    name: {
      first: '',
      last: ''
    },
    email: '',
    password: ''
  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private homeService: HomeService,
              public authService: AuthService) {}

  ngOnInit() {
    this.preloader = false;
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
          this.flashMessages.show("Account Successfully created, check your email to confirm account before logging in", {cssClass: 'alert-success', timeout: 6000});
          setTimeout(() => {
            this.router.navigate(['/c/login']);
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
