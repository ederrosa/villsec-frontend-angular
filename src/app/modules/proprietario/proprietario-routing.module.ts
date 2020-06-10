import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProprietarioInsertComponent } from './proprietario-insert/proprietario-insert.component';
import { ProprietarioUpdateComponent } from './proprietario-update/proprietario-update.component';
import { ProprietarioFindPageComponent } from './proprietario-find-page/proprietario-find-page.component';
import { Error404Component } from '../error/error404/error404.component';
import { AuthGuard } from 'src/app/core/guards/can-activate/auth-guard';

const routes: Routes = [
  { path: 'novo', component: ProprietarioInsertComponent, canActivate: [AuthGuard] },
  { path: 'editar/:id', component: ProprietarioUpdateComponent, canActivate: [AuthGuard]},
  { path: '', component: ProprietarioFindPageComponent },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProprietarioRoutingModule { }
