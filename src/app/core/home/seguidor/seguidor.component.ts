import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-seguidor',
  templateUrl: './seguidor.component.html',
  styleUrls: ['./seguidor.component.scss']
})
export class SeguidorComponent implements OnInit {

  constructor(private theAuthenticationServices: AuthenticationService) { }

  ngOnInit(): void {
  }
  logout() {
    this.theAuthenticationServices.logout();
  }

}
