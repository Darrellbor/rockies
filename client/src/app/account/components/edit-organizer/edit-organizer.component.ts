import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-organizer',
  templateUrl: './edit-organizer.component.html',
  styleUrls: ['./edit-organizer.component.css']
})
export class EditOrganizerComponent implements OnInit {
  preloader:boolean = true;
  organizerLogo;
  flashAlert:boolean = false;
  organizer = {
    _id: '',
    name: '',
    about: '',
    url: '',
    phone: '',
    email: '',
    socials: {
        facebook: '',
        twitter: '',
        instagram: '',
        website: '',
        blog: ''
    },
    logo: '',
    background_color: '#432d47',
    text_color: '#fff',
  }

  customStyle = {
    selectButton: {
      "background-color": "#2c0f31",
      "border-radius": "25px",
      "color": "#fff"
    },
    clearButton: {
      "background-color": "#FFF",
      "border-radius": "25px",
      "color": "#000",
      "margin-left": "10px"
    },
    layout: {
      "background-color": "#dadada",
      "border-radius": "25px",
      "font-size": "15px",
      "padding-top": "5px",
      "max-width": "500px"
    },
    previewPanel: {
      "background-color": "#fff",
      "border-radius": "0 0 25px 25px",
    }
  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private accountService: AccountService,
              public authService: AuthService) {}

  ngOnInit() {
    this.route.data
      .subscribe((res) => {
        let organizerDetails;
        organizerDetails = res.organizerDetails.profile[0];
        this.organizer = organizerDetails;
        this.preloader = false;
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

  onUploadFinished(logo) {
    this.organizerLogo = logo.file; 
    this.uploadOrganizerLogo();   
  }

  uploadOrganizerLogo() {
    if(this.organizer.name === "") {
      this.flashAlert = true;
      setTimeout(() => {
        this.flashMessages.show("Organizer name cannot be empty, please fill in the name and re-upload organizer logo", {cssClass: 'alert-danger', timeout: 6000});
        setTimeout(() => {
          this.flashAlert = false;
        },6000);
      }, 500);
    } else {
      const fd = new FormData();
      fd.append('organizerLogo', this.organizerLogo);
      
      if(this.organizer.url !== "") {
        fd.append('url', this.organizer.url);
      } else {
        fd.append('name', this.organizer.name);
      }

      this.accountService.uploadOrganizerLogo(fd)
        .subscribe((res) => {
          this.organizer.logo = res.logo;
          this.organizer.url = res.url;
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

  updateOF({value, valid}) {
    if(!valid) {
      this.flashAlert = true;
      setTimeout(() => {
        this.flashMessages.show("Invalid form submission!", {cssClass: 'alert-danger', timeout: 6000});
        setTimeout(() => {
          this.flashAlert = false;
        },6000);
      }, 500);
    } else {
      if(this.organizer.socials.website === "" && this.organizer.socials.facebook === "" &&
         this.organizer.socials.twitter === "" && this.organizer.socials.instagram === "" &&
         this.organizer.socials.blog === "") {
          this.flashAlert = true;
          setTimeout(() => {
            this.flashMessages.show("You must put at least one social media account!", {cssClass: 'alert-danger', timeout: 6000});
            setTimeout(() => {
              this.flashAlert = false;
            },6000);
          }, 500);
      } else if(this.organizer.url === "") {
          this.flashAlert = true;
          setTimeout(() => {
            this.flashMessages.show("An organizer logo is required!", {cssClass: 'alert-danger', timeout: 6000});
            setTimeout(() => {
              this.flashAlert = false;
            },6000);
          }, 500);
      } else {
        this.accountService.editOrganizer(this.organizer._id, this.organizer)
          .subscribe((res) => {
            this.flashAlert = true;
            setTimeout(() => {
              this.flashMessages.show("Organizer profile successfully updated!", {cssClass: 'alert-success', timeout: 6000});
              setTimeout(() => {
                this.flashAlert = false;
                this.router.navigate(['/a/organizers']);
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

}
