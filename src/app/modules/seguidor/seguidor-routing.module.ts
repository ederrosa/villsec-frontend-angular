import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeguidorUpdateComponent } from './seguidor-update/seguidor-update.component';
import { SeguidorFindPageComponent } from './seguidor-find-page/seguidor-find-page.component';
import { Error404Component } from '../error/error404/error404.component';

const routes: Routes = [
  { path: 'editar/:id', component: SeguidorUpdateComponent},
  { path: '', component: SeguidorFindPageComponent},
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguidorRoutingModule { }
