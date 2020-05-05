import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private theAuthenticationServices: AuthenticationService) { }

  ngOnInit(): void {
  }
  logout() {
    this.theAuthenticationServices.logout();
  }
}
