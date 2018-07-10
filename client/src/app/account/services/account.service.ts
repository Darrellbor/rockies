import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthService } from '../../services/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class AccountService {

  constructor(private http: Http, private authService: AuthService) {}

  updateProfile(user) {
    this.authService.createHeaders();
    return this.http.put(this.authService.url + 'api/users/profile', user, this.authService.options)
      .map(res => res.json());
  }

  changePassword(passwords) {
    let builtQuery = {
      "type": "Password",
      "oldPassword": passwords.oldPassword,
      "newPassword": passwords.newPassword,
      "confirmNewPassword": passwords.confirmNewPassword
    }
    this.authService.createHeaders();
    return this.http.patch(this.authService.url + 'api/users/profile', builtQuery, this.authService.options)
      .map(res => res.json());
  }

  getAllUserOrganizers() {
    this.authService.createHeaders();
    return this.http.get(this.authService.url + 'api/organizer', this.authService.options)
      .map(res => res.json());
  }

   getOrganizerDetailsByUrl(url) {
    return this.http.get(this.authService.url + 'api/organizer/'+url)
      .map(res => res.json());
  }

  listPaystackBanks() {
    this.authService.paystackHeaders();
    return this.http.get('https://api.paystack.co/bank', this.authService.options)
      .map(res => res.json());
  }

  resolveBank(bank, accountNo) {
    this.authService.paystackHeaders();
    return this.http.get('https://api.paystack.co/bank/resolve?account_number='+accountNo+'&bank_code='+bank, this.authService.options)
      .map(res => res.json());
  }

  createSubaccount(businessName, settlementBank, accountNo) {
    this.authService.paystackHeaders();
    return this.http.post('https://api.paystack.co/subaccount',{
      "business_name": businessName, "settlement_bank": settlementBank, "account_number": accountNo, "percentage_charge": 5
    }, this.authService.options)
      .map(res => res.json());
  }

  getCategories() {
    return this.http.get(this.authService.url + 'api/settings/categories')
      .map(res => res.json());
  }

  addCategory(category) {
    this.authService.createHeaders();
    return this.http.post(this.authService.url + 'api/settings/categories', { name: category}, this.authService.options)
      .map(res => res.json());
  }

  getEventDetailsByLink(id) {
    return this.http.get(this.authService.url + 'api/events/'+id)
      .map(res => res.json());
  }

  getLocationChoords(address) {
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyCPMQxvJGqj6EDiAb1Zqdjl002nogzEVfA')
      .map(res => res.json());
  }

  uploadEventImage(payload) {
    this.authService.createImageHeaders();
    return this.http.post(this.authService.url + 'api/events/uploadImage', payload, this.authService.options)
      .map(res => res.json());
  }

  createEvent(payload) {
    this.authService.createHeaders();
    return this.http.post(this.authService.url + 'api/events', payload, this.authService.options)
      .map(res => res.json());
  }

  getMyEvents() {
    this.authService.createHeaders();
    return this.http.get(this.authService.url + 'api/users/events', this.authService.options)
      .map(res => res.json());
  }

  editEvent(id, payload) {
    this.authService.createHeaders();
    return this.http.put(this.authService.url + 'api/events/'+id, payload, this.authService.options)
      .map(res => res.json());
  }

  removeEvent(id) {
    this.authService.createHeaders();
    return this.http.delete(this.authService.url + 'api/events/'+id, this.authService.options)
      .map(res => res.json());
  }

  makeEventLive(link) {
    return this.http.patch(this.authService.url + 'api/events/'+link, { activate: 'Status' })
      .map(res => res.json());
  }

  checkAvailability(title) {
    return this.http.get(this.authService.url + 'api/events/search?for=eventLink&title='+title)
      .map(res => res.json());
  }

  getOrders() {
    this.authService.createHeaders();
    return this.http.get(this.authService.url + 'api/users/tickets', this.authService.options)
      .map(res => res.json());
  }

  getOrderByIds(eventId, orderId) {
    this.authService.createHeaders();
    return this.http.get(this.authService.url + 'api/users/events/'+eventId+'/tickets/'+orderId, this.authService.options)
      .map(res => res.json());
  }

  getReviews() {
    this.authService.createHeaders();
    return this.http.get(this.authService.url + 'api/users/events/reviews', this.authService.options)
      .map(res => res.json());
  }

  editReview(eventId, reviewId, review) {
    this.authService.createHeaders();
    return this.http.put(this.authService.url + 'api/events/'+eventId+'/reviews/'+reviewId, { review: review }, this.authService.options)
      .map(res => res.json());
  }

  deleteReview(eventId, reviewId) {
    this.authService.createHeaders();
    return this.http.delete(this.authService.url + 'api/events/'+eventId+'/reviews/'+reviewId, this.authService.options)
      .map(res => res.json());
  }

}
