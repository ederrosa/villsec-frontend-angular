import { Component, OnInit } from '@angular/core';
import { ILocalUser } from 'src/app/shared/models/domain/ilocal-user';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  readonly ADMIN = 1;
  readonly PROPRIETARIO = 2;
  readonly SEGUIDOR = 3;
  user: number;
  private localUser: ILocalUser;

  constructor() { }

  ngOnInit() {   
    this.localUser = JSON.parse(sessionStorage.getItem('localUser')) as ILocalUser;
    if (this.localUser != null) {
      this.user = this.localUser.theTipoUsuario;
    } else {
      this.user = 0;
    }   
  }
}
