import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logOut() {
    let out = window.confirm('Logging out... Click ok to continue');
    if(out) {
      this.authService.logOut();
      this.router.navigate(['/c/login']);
    }
  }

}
