import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthService } from '../../services/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class HomeService {

  constructor(private http: Http, private authService: AuthService) {}

  fetchEvents(url, filter) {
    return this.http.post(this.authService.url + url, filter)
      .map(res => res.json());
  }

  getLocations(url) {
    return this.http.get(this.authService.url + url)
      .map(res => res.json());
  }

  getCategories() {
    return this.http.get(this.authService.url + 'api/settings/categories')
      .map(res => res.json());
  }

}
