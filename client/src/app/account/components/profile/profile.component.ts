import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../../services/auth.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  preloader:boolean = true;
  profile;
  accountAlert:boolean = false;
  passwordAlert:boolean = false;
  user = {
    name: {
      first: '',
      last: ''
    },
    email: ''
  }
  passwords = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }

  constructor(private authService: AuthService,
              private accountService: AccountService,
              private flashMessages: FlashMessagesService) { }

  ngOnInit() {
    this.getProfile();
    this.preloader = false;
  }

  sendPasswordChanged() {
    let payload = {
      "to": this.authService.decodedJwt().email,
      "subject": "Password Changed",
      "messageObj": {
        name: this.authService.decodedJwt().name.first
      },
      "template": "/templates/passwordChanged.html"
    }

    this.authService.sendMail(payload)
      .subscribe((res) => {
      }, (err) => {
        let val = JSON.parse(err._body);
        console.log(err);
      });
  }

  getProfile() {
    this.authService.getProfile()
      .subscribe((res) => {
        this.profile = res;
        this.user.email = res.email;
        this.user.name.first = res.name.first;
        this.user.name.last = res.name.last;
      }, (err) => {
        this.accountAlert = true;
        setTimeout(() => {
          let val = JSON.parse(err._body);
          this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 6000});
          setTimeout(() => {
            this.accountAlert = false;
          },6000);
        }, 500);
      });
  }

  accountEdit({value, valid}) {
    value['name'] = {
      first: value.first,
      last: value.last
    }

    delete value.first;
    delete value.last;
    delete value.email;

    if(valid) {      
      this.accountService.updateProfile(value)
        .subscribe((res) => {
          this.accountAlert = true;
          setTimeout(() => {
            this.flashMessages.show("Updates have been saved", {cssClass: 'alert-success', timeout: 6000});
            setTimeout(() => {
              this.accountAlert = false;
            },6000);
          }, 500);
        }, (err) => {          
          this.accountAlert = true;
          setTimeout(() => {
            let val = JSON.parse(err._body);
            this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 6000});
            setTimeout(() => {
              this.accountAlert = false;
            },6000);
          },500);
        });
    } else {
      this.accountAlert = true;
      setTimeout(() => {
        this.flashMessages.show('Invalid form submission!', {cssClass: 'alert-danger', timeout: 6000});
        setTimeout(() => {
          this.accountAlert = false;
        },6000);
      }, 500);
    }
  }

  changePassword({value, valid}) {
    if(value.newPassword !== value.confirmNewPassword) {
      this.passwordAlert = true;
      setTimeout(() => {
        this.flashMessages.show('New passwords do not match', {cssClass: 'alert-danger', timeout: 6000});
        setTimeout(() => {
          this.passwordAlert = false;
        },6000);
      }, 500);
    } else {
      if(valid) {      
        this.accountService.changePassword(value)
          .subscribe((res) => {
            this.passwords.oldPassword = "";
            this.passwords.newPassword = "";
            this.passwords.confirmNewPassword = "";
            this.passwordAlert = true;
            setTimeout(() => {
              this.sendPasswordChanged();
              this.flashMessages.show("Password has been successfully updated", {cssClass: 'alert-info', timeout: 6000});
              setTimeout(() => {
                this.passwordAlert = false;
              },6000);
            }, 500);
          }, (err) => {          
            this.passwordAlert = true;
            setTimeout(() => {
              let val = JSON.parse(err._body);
              this.flashMessages.show(val.message, {cssClass: 'alert-danger', timeout: 6000});
              setTimeout(() => {
                this.passwordAlert = false;
              },6000);
            },500);
          });
      } else {
        this.passwordAlert = true;
        setTimeout(() => {
          this.flashMessages.show('Invalid form submission!', {cssClass: 'alert-danger', timeout: 6000});
          setTimeout(() => {
            this.passwordAlert = false;
          },6000);
        }, 500);
      }
    }
  }

}
