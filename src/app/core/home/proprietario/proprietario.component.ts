import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-proprietario',
  templateUrl: './proprietario.component.html',
  styleUrls: ['./proprietario.component.scss']
})
export class ProprietarioComponent implements OnInit {

  constructor(private theAuthenticationServices: AuthenticationService) { }

  ngOnInit(): void {
  }
  logout() {
    this.theAuthenticationServices.logout();
  }
}
