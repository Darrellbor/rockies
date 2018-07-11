import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  _id;
  preloader:boolean = true;
  eventDetails;
  organizerList;
  organizerName = '';
  freeTicketInstance:boolean = false;
  paidTicketInstance:boolean = false;
  vipTicketInstance:boolean = false;
  ticketStartTime = '';
  ticketEndTime = '';
  vipTicketStartTime = '';
  vipTicketEndTime = '';
  banks;
  bankDetails;
  bankName = '';
  categoriesList;
  isCategoryListed:boolean = true;
  verifyAlert:boolean = false;
  finalAlert:boolean = false;
  eventImage;
  exclusiveCat = '';
  exclusiveCheck:boolean = false;
  event = {
    status: 'Live',
    exclusive: 'No',
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    eventImage: '',
    eventLink: '',
    description: '',
    location: {
      name: '',
      address: {
        street: '',
        cityOrProvince: '',
        state: '',
        zipCode: '',
        country: ''
      },
      coordinates: [],
      showMap: 'Yes'
    },
    organizer: {
      _id: '',
      user_id: '',
      socials: {},
      name: '',
      about: '',
      phone: '',
      email: '',
      logo: '',
      url: ''
    },
    ticket: [{
      name: '',
      type: '',
      normalType: '',  //accepts a free or paid
      description: '',
      quantity: 1,
      price: 0.00,
      ticketSaleStarts: '',
      ticketSaleEnds: '',
      maxTicketPerPerson: 1,
      showTicket: 'Yes'
    },
    {
        name: '',
        type: '',
        normalType: '',  //accepts a free or paid
        description: '',
        quantity: 1,
        price: 0.00,
        ticketSaleStarts: '',
        ticketSaleEnds: '',
        maxTicketPerPerson: 1,
        showTicket: 'Yes'
      }],
    payout: {
      subaccountCode: '',
      settlementBank: '',
      accountNo: ""
    },
    settings: {
      category: '',
      reservationLimit: '',
      showVipRemaining: 'Yes',
      showNormalRemaining: 'Yes'
    }
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
    this.route.params 
      .subscribe((res) => {
        this._id = res.id;
      }, (err) => {
        window.alert('An error occured, please reload the page!');
      });
    this.route.data 
      .subscribe((res) => {
        this.eventDetails = res.eventDetails;
        this.event = this.eventDetails;
        this.pageBuilder();
        this.getOrganizersList();
        this.fetchPaystackBanks();
        this.fetchCategories();
        this.preloader = false;
      }, (err) => {
        window.alert('An error occured, please reload the page!');
      });
  }

  pageBuilder() {
    //handle start dates
    let startDate;
    let startTime;
    startDate = this.event.startDate.split("T");
    startTime = startDate[1].split(".");
    this.event.startDate = startDate[0];
    this.event.startTime = startTime[0];

    //handle end dates
    let endDate;
    let endTime;
    endDate = this.event.endDate.split("T");
    endTime = endDate[1].split(".");
    this.event.endDate = endDate[0];
    this.event.endTime = endTime[0];

    //handle free or paid ticket start dates and time
    let ticketSaleStarts;
    let ticketStartTime;
    ticketSaleStarts = this.event.ticket[0].ticketSaleStarts.split("T");
    ticketStartTime = ticketSaleStarts[1].split(".");
    this.event.ticket[0].ticketSaleStarts = ticketSaleStarts[0];
    this.ticketStartTime = ticketStartTime[0];

    //handle free or paid ticket end dates and time
    let ticketSaleEnds;
    let ticketEndTime;
    ticketSaleEnds = this.event.ticket[0].ticketSaleEnds.split("T");
    ticketEndTime = ticketSaleEnds[1].split(".");
    this.event.ticket[0].ticketSaleEnds = ticketSaleEnds[0];
    this.ticketEndTime = ticketEndTime[0];
    
    if(this.event.ticket[0].normalType === "Paid") {
      this.paidTicketInstance = true;
    } else {
      this.freeTicketInstance = true;
    }

    if(this.event.ticket[1] === null) {
      this.event.ticket[1] = {
        name: '',
        type: '',
        normalType: '',  //accepts a free or paid
        description: '',
        quantity: 1,
        price: 0.00,
        ticketSaleStarts: '',
        ticketSaleEnds: '',
        maxTicketPerPerson: 1,
        showTicket: 'Yes'
      }
    } else {
      //handle vip ticket dates and time
      let ticketSaleStarts1;
      let vipTicketStartTime;
      ticketSaleStarts1 = this.event.ticket[1].ticketSaleStarts.split("T");
      vipTicketStartTime = ticketSaleStarts1[1].split(".");
      this.event.ticket[1].ticketSaleStarts = ticketSaleStarts1[0];
      this.vipTicketStartTime = vipTicketStartTime[0];

      //handle vip ticket dates and time
      let ticketSaleEnds1;
      let vipTicketEndTime;
      ticketSaleEnds1 = this.event.ticket[1].ticketSaleEnds.split("T");
      vipTicketEndTime = ticketSaleEnds1[1].split(".");
      this.event.ticket[1].ticketSaleEnds = ticketSaleEnds1[0];
      this.vipTicketEndTime = vipTicketEndTime[0];

      this.vipTicketInstance = true;
    }

  }

  fetchPaystackBanks() {
    this.accountService.listPaystackBanks()
      .subscribe((res) => {
        this.banks = res.data;
      }, (err) => {
          console.log(err);
      });
  }

  verifyAccount() {
    if(this.event.payout.settlementBank !== "" && this.event.payout.accountNo !== "") {
      this.accountService.resolveBank(this.event.payout.settlementBank, this.event.payout.accountNo)
        .subscribe((res) => {
          let accountName = res.data.account_name;

          this.accountService.createSubaccount(this.event.organizer.name, this.bankName, this.event.payout.accountNo)
            .subscribe((res) => {
              this.event.payout.subaccountCode = res.data.subaccount_code;
              this.verifyAlert = true;
              setTimeout(() => {
                this.flashMessages.show("Account Name: "+accountName+", account verified!", {cssClass: 'alert-info', timeout: 6000});
                setTimeout(() => {
                  this.verifyAlert = false;
                },6000);
              }, 500);
            }, (err) => {
              this.verifyAlert = true;
              setTimeout(() => {
                this.flashMessages.show("An error occured trying to verify your account!", {cssClass: 'alert-danger', timeout: 4000});
                setTimeout(() => {
                  this.verifyAlert = false;
                },4000);
              }, 500);
            });

        }, (err) => {
          this.verifyAlert = true;
          setTimeout(() => {
            this.flashMessages.show("An error occured trying to verify your account!", {cssClass: 'alert-danger', timeout: 4000});
            setTimeout(() => {
              this.verifyAlert = false;
            },4000);
          }, 500);
        });
    } else {
      this.verifyAlert = true;
      setTimeout(() => {
        this.flashMessages.show("Please select a bank and provide your account number", {cssClass: 'alert-danger', timeout: 6000});
        setTimeout(() => {
          this.verifyAlert = false;
        },6000);
      }, 500);
    }
  }

  getBankDetails() {
    this.bankDetails = this.bankDetails.split(",");
    this.event.payout.settlementBank = this.bankDetails[0];
    this.bankName = this.bankDetails[1];
  }

  fetchCategories() {
    this.accountService.getCategories()
      .subscribe((res) => {
        this.categoriesList = res;
      }, (err) => {
        window.alert("An error occured getting details for this page, please reload!");
        console.log(err);
      });
  }

  getOrganizersList() {
    this.accountService.getAllUserOrganizers()
      .subscribe((res) => {
        this.organizerList = res;
      }, (err) => {
        let val = JSON.parse(err._body);
        window.alert(val.message);
        console.log(err);
      });
  }

  getOrganizerDetails(event) {
    if(this.organizerName !== "") {
      this.accountService.getOrganizerDetailsByUrl(this.organizerName)
      .subscribe((res) => {
        delete res.profile[0].background_color;
        delete res.profile[0].text_color;
        delete res.profile[0].createdOn;
        this.event.organizer = res.profile[0];
      }, (err) => {
        let val = JSON.parse(err._body);
        window.alert(val.message);
        console.log(err);
      });
    }
    
  }

  onUploadFinished(event) {
    this.eventImage = event.file; 
    this.uploadEventImage();   
  }

  uploadEventImage() {
    if(this.event.title === "") {
      window.alert("Event title cannot be empty, please fill in the title and re-upload event image");
    } else {
      const fd = new FormData();
      fd.append('eventImage', this.eventImage);
      
      if(this.event.eventLink !== "") {
        fd.append('eventLink', this.event.eventLink);
      } else {
        fd.append('title', this.event.title);
      }

      this.accountService.uploadEventImage(fd)
        .subscribe((res) => {
          this.event.eventImage = res.eventImage;
          this.event.eventLink = res.eventLink;
        }, (err) => {
          let val = JSON.parse(err._body);
          window.alert(val.message);
          console.log(err);
        });
    }
  }

  resetLocation() {
    this.event.location = {
      name: '',
      address: {
        street: '',
        cityOrProvince: '',
        state: '',
        zipCode: '',
        country: this.event.location.address.country
      },
      coordinates: [],
      showMap: 'Yes'
    }
  }

  toggleShowMap() {
    this.event.location.showMap === "Yes" ? this.event.location.showMap = "No" : this.event.location.showMap = "Yes";
  }

  toggleshowTickets(type) {
    if(type === "freeOrPaid") {
      this.event.ticket[0].showTicket === "Yes" ? this.event.ticket[0].showTicket = "No" : this.event.ticket[0].showTicket = "Yes";
    } else if(type === "vip") {
      this.event.ticket[1].showTicket === "Yes" ? this.event.ticket[1].showTicket = "No" : this.event.ticket[1].showTicket = "Yes";
    }
  }

  changeCatToField() {
    this.isCategoryListed === true ? this.isCategoryListed = false : this.isCategoryListed = true;
  }

  changeExclusive() {
    this.event.exclusive === "No" ? this.event.exclusive = "Yes" : this.event.exclusive = "No";

    if(this.event.settings.category === "" && this.exclusiveCheck === false) {
      window.alert('Please select or fill in a category and recheck to take effect!');
    } else if(this.exclusiveCheck === false && this.event.settings.category !== "") {
      this.exclusiveCat = this.event.settings.category;
      this.exclusiveCheck = true;
    } else {
      if(this.event.exclusive === "Yes" && this.exclusiveCheck === true) {
        this.event.settings.category = "exclusive"
      } else {
        this.event.settings.category = this.exclusiveCat;
      }
    }
  }

  onTicketInstanceClick(ticket, type) {
    if(ticket === "Free" && type === "Add") {
      this.event.ticket[0].type = "Normal";
      this.event.ticket[0].normalType = "Free";
      this.freeTicketInstance = true;
    } else if(ticket === "Paid" && type === "Add") {
      this.event.ticket[0].type = "Normal";
      this.event.ticket[0].normalType = "Paid";
      this.paidTicketInstance = true;
    } else if(ticket === "Vip" && type === "Add") {
      this.event.ticket[1].type = "Vip";
      this.event.ticket[1].normalType = "Vip";
      this.vipTicketInstance = true;
    } else if((ticket === "Free" || ticket === "Paid" || ticket === "Vip") && type === "Remove") {
      this.event.ticket = [{
      name: '',
      type: '',
      normalType: '',  //accepts a free or paid
      description: '',
      quantity: 1,
      price: 0.00,
      ticketSaleStarts: '',
      ticketSaleEnds: '',
      maxTicketPerPerson: 1,
      showTicket: 'Yes'
    },
    {
        name: '',
        type: '',
        normalType: '',  //accepts a free or paid
        description: '',
        quantity: 1,
        price: 0.00,
        ticketSaleStarts: '',
        ticketSaleEnds: '',
        maxTicketPerPerson: 1,
        showTicket: 'Yes'
      }]
      this.freeTicketInstance = false;
      this.paidTicketInstance = false;
      this.vipTicketInstance = false;
    }
  }

  saveEvent() {
    this.event.status = "Saved";

    if(this.event.ticket[0].name === "" || this.event.ticket[0].description === "") {
      this.finalAlert = true;
      setTimeout(() => {
        this.flashMessages.show("Ticket details were not recorded", {cssClass: 'alert-danger', timeout: 5000});
        setTimeout(() => {
          this.finalAlert = false;
        },5000);
      }, 500);
      return;
    }

    if(this.event.eventImage === "") {
      this.finalAlert = true;
      setTimeout(() => {
        this.flashMessages.show("Please upload an event image", {cssClass: 'alert-danger', timeout: 4000});
        setTimeout(() => {
          this.finalAlert = false;
        },4000);
      }, 500);
      return;
    }

    if(this.paidTicketInstance || this.vipTicketInstance && this.event.payout.subaccountCode === "") {
      this.finalAlert = true;
      setTimeout(() => {
        this.flashMessages.show("Please re-verify your payout details", {cssClass: 'alert-danger', timeout: 5000});
        setTimeout(() => {
          this.finalAlert = false;
        },5000);
      }, 500);
      return;
    }
    this.event.startDate = this.event.startDate +" "+ this.event.startTime;
    this.event.endDate = this.event.endDate +" "+ this.event.endTime;
    this.event.ticket[0].ticketSaleStarts = this.event.ticket[0].ticketSaleStarts +" "+ this.ticketStartTime;
    this.event.ticket[0].ticketSaleEnds = this.event.ticket[0].ticketSaleEnds +" "+ this.ticketEndTime;

    if(this.event.ticket[1].name !== "" && this.event.ticket[1].description !== "") {
      this.event.ticket[1].ticketSaleStarts = this.event.ticket[1].ticketSaleStarts +" "+ this.vipTicketStartTime;
      this.event.ticket[1].ticketSaleEnds = this.event.ticket[1].ticketSaleEnds +" "+ this.vipTicketEndTime;
    } else {
      this.event.ticket[1] = undefined;
    }

    delete this.event.startTime;
    delete this.event.endTime;

    if(!this.isCategoryListed) {
      this.accountService.addCategory(this.event.settings.category)
        .subscribe((res) => {
          this.finalAlert = true;
          setTimeout(() => {
            this.flashMessages.show("New category added!", {cssClass: 'alert-info', timeout: 3000});
            setTimeout(() => {
              this.finalAlert = false;
            },3000);
          }, 500);
        }, (err) => {
          this.finalAlert = true;
          setTimeout(() => {
            this.flashMessages.show("An error occured creating your event, please retry", {cssClass: 'alert-danger', timeout: 4000});
            setTimeout(() => {
              this.finalAlert = false;
            },4000);
          }, 500);
        });
    }

    this.accountService.getLocationChoords(this.event.location.address.street+" "+this.event.location.address.state+" "+this.event.location.address.country)
      .subscribe((res) => {
        this.event.location.coordinates.push(res.results[0].geometry.location.lng);
        this.event.location.coordinates.push(res.results[0].geometry.location.lat);

        this.accountService.editEvent(this._id, this.event)
          .subscribe((res) => {

            this.finalAlert = true;
              setTimeout(() => {
              this.flashMessages.show("Event Successfully Edited And Is Saved!", {cssClass: 'alert-success', timeout: 6000});
              setTimeout(() => {
                this.finalAlert = false;
                this.router.navigate(['/a/myEvents']);
              },6000);
            }, 500);
          }, (err) => {
            this.finalAlert = true;
              setTimeout(() => {
              this.flashMessages.show("An error occured creating your event, please retry", {cssClass: 'alert-danger', timeout: 4000});
              setTimeout(() => {
                this.finalAlert = false;
              },4000);
            }, 500);
          });

      }, (err) => {
        this.finalAlert = true;
        setTimeout(() => {
        this.flashMessages.show("An error occured creating your event, please retry", {cssClass: 'alert-danger', timeout: 4000});
        setTimeout(() => {
          this.finalAlert = false;
        },4000);
      }, 500);
      });
  }

}
