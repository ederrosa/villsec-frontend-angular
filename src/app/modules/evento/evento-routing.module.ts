import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Error404Component } from '../error/error404/error404.component';
import { EventoInsertComponent } from './evento-insert/evento-insert.component';
import { EventoUpdateComponent } from './evento-update/evento-update.component';
import { EventoFindPageComponent } from './evento-find-page/evento-find-page.component';
import { AuthGuardChild } from 'src/app/core/guards/can-activate-child/auth-guard-child';

const routes: Routes = [
  { path: 'novo', component: EventoInsertComponent, canActivate: [AuthGuardChild] },
  { path: 'editar/:id', component: EventoUpdateComponent, canActivate: [AuthGuardChild] },
  { path: '', component: EventoFindPageComponent},
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventoRoutingModule { }
