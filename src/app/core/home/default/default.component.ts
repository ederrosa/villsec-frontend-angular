import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  constructor(private theAuthenticationServices: AuthenticationService) { }

  ngOnInit(): void {
  }
  logout() {
    this.theAuthenticationServices.logout();
  }
}
