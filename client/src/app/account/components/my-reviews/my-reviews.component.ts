import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.css']
})
export class MyReviewsComponent implements OnInit {
  preloader:boolean = true;
  myReviews;
  reviewsToShow:boolean = false;
  flashAlert:boolean = false;
  editBox:boolean = false;
  editBoxENo = 0;
  editBoxRNo = 0;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private flashMessages: FlashMessagesService,
              private accountService: AccountService,
              public authService: AuthService) {}

  ngOnInit() {
    this.route.data
      .subscribe((res) => {
        this.myReviews = res.myReviews;

        if(!this.myReviews.message) {
          this.reviewsToShow = true;          
        }
        console.log(this.myReviews);
        this.preloader = false;
      }, (err) => {
        window.alert('An error occured, please refresh and try again');
        console.log(err);
      });
  }

  deleteReview(eventId, reviewId, eventI, reviewI) {
    let r = window.confirm('Deleting review... Click ok to continue');

    if(r) {
      this.accountService.deleteReview(eventId, reviewId)
        .subscribe((res) => {
          this.myReviews[eventI].reviews.splice(reviewI, 1);
          this.flashAlert = true;
          setTimeout(() => {
            this.flashMessages.show("Review Successfully Deleted!", {cssClass: 'alert-info', timeout: 6000});
            setTimeout(() => {
              this.flashAlert = false;
            },6000);
          }, 500);
        }, (err) => {
          this.flashAlert = true;
          setTimeout(() => {
            this.flashMessages.show("An error occured trying to delete your review. Try again!", {cssClass: 'alert-danger', timeout: 6000});
            setTimeout(() => {
              this.flashAlert = false;
            },6000);
          }, 500);
          console.log(err);
        });
    }
  }

  setEditView(eventI, reviewI) {
    this.editBox = true;
    this.editBoxENo = eventI;
    this.editBoxRNo = reviewI;
  }

  editReview(eventId, reviewId, eventI, reviewI) {
    let myEditedReview = this.myReviews[eventI].reviews[reviewI].review;
    if(myEditedReview !== "") {
      this.accountService.editReview(eventId, reviewId, myEditedReview)
        .subscribe((res) => {
          this.editBox = false;
          this.editBoxENo = -1;

          this.flashAlert = true;
          setTimeout(() => {
            this.flashMessages.show("Review Successfully Updated!", {cssClass: 'alert-success', timeout: 6000});
            setTimeout(() => {
              this.flashAlert = false;
            },6000);
          }, 500);
        }, (err) => {
          this.flashAlert = true;
          setTimeout(() => {
            this.flashMessages.show("An error occured trying to edit your review. Try again!", {cssClass: 'alert-danger', timeout: 6000});
            setTimeout(() => {
              this.flashAlert = false;
            },6000);
          }, 500);
          console.log(err);
        });

    } else {
      this.flashAlert = true;
      setTimeout(() => {
        this.flashMessages.show("Invalid form submission. Field cannot be empty", {cssClass: 'alert-danger', timeout: 6000});
        setTimeout(() => {
          this.flashAlert = false;
        },6000);
      }, 500);
    }
  }

}
