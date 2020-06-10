import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeguidorInsertComponent } from './seguidor-insert/seguidor-insert.component';
import { SeguidorUpdateComponent } from './seguidor-update/seguidor-update.component';
import { SeguidorFindPageComponent } from './seguidor-find-page/seguidor-find-page.component';
import { Error404Component } from '../error/error404/error404.component';
import { AuthGuard } from 'src/app/core/guards/can-activate/auth-guard';

const routes: Routes = [
  { path: 'novo', component: SeguidorInsertComponent },
  { path: 'editar/:id', component: SeguidorUpdateComponent, canActivate: [AuthGuard]},
  { path: '', component: SeguidorFindPageComponent, canActivate: [AuthGuard] },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguidorRoutingModule { }
