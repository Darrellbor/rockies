import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class AuthService {

  url:string = 'http://localhost:3000/';
  authToken;
  options;

  createHeaders() {
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': 'Bearer '+this.authToken
      })
    });
  }

  constructor(private http:Http) { }

  registerUser(user) {
    this.createHeaders();
    return this.http.post(this.url+'api/users/register', user, this.options)
      .map(res => res.json());
  }

  loginUser(user) {
    this.createHeaders();
    return this.http.post(this.url+'api/users/login', user, this.options)
      .map(res => res.json());
  }

  getProfile() {
    this.createHeaders();
    return this.http.get(this.url+'api/users/profile', this.options)
      .map(res => res.json());
  }

  logOut() {
    this.authToken = null;
    localStorage.removeItem('token');
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  storeUserToken(token) {
    this.logOut();
    localStorage.setItem('token', token);
    this.authToken = token;
  }

  notAuthorized() {
    this.loadToken();
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(this.authToken);
    return isExpired;
  }

  decodedJwt() {
    this.loadToken();
    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(this.authToken);
    const expirationDate = helper.getTokenExpirationDate(this.authToken);
    
    return decodedToken;
  }

}
