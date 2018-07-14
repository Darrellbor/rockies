import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthService } from '../../services/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class HomeService {

  constructor(private http: Http, private authService: AuthService) {}

  fetchEvents(link, filter) {
    return this.http.post(this.authService.url + link, filter)
      .map(res => res.json());
  }

  getLocations(link) {
    return this.http.get(this.authService.url + link)
      .map(res => res.json());
  }

  getCategories() {
    return this.http.get(this.authService.url + 'api/settings/categories')
      .map(res => res.json());
  }

  updateTotalViewed(link) {
    return this.http.patch(this.authService.url + 'api/events/'+link, { viewed: 1 })
      .map(res => res.json());
  }

  getEventDetailsByLink(link) {
    return this.http.get(this.authService.url + 'api/events/search?for=eventLink&title='+link)
      .map(res => res.json());
  }

  addReview(link, review) {
    this.authService.createHeaders();
    return this.http.post(this.authService.url + 'api/events/'+link+'/reviews', review, this.authService.options)
      .map(res => res.json());
  }

  nextOrganizerEvents(id) {
    return this.http.get(this.authService.url + 'api/events/organizer/'+id)
      .map(res => res.json());
  }

  getOrganizerDetailsByUrl(url) {
    return this.http.get(this.authService.url + 'api/organizer/'+url)
      .map(res => res.json());
  }

  categoryTimes(category) {
    this.authService.createHeaders();
    return this.http.patch(this.authService.url + 'api/users/profile', { type: 'Categories', name: category }, this.authService.options)
      .map(res => res.json());
  }

  forgetPassword(email) {
    return this.http.post(this.authService.url + 'api/users/forgotPassword', { email: email })
      .map(res => res.json());
  }

  confirmAccount() {
    this.authService.createHeaders();
    return this.http.patch(this.authService.url + 'api/users/profile', { type: 'Confirm' }, this.authService.options)
      .map(res => res.json());
  }

}
