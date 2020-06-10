import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElementoInsertComponent } from './elemento-insert/elemento-insert.component';
import { ElementoUpdateComponent } from './elemento-update/elemento-update.component';
import { ElementoFindPageComponent } from './elemento-find-page/elemento-find-page.component';
import { Error404Component } from '../error/error404/error404.component';
import { AuthGuard } from 'src/app/core/guards/can-activate/auth-guard';


const routes: Routes = [
  { path: 'novo', component: ElementoInsertComponent, canActivate: [AuthGuard]},
  { path: 'editar/:id', component: ElementoUpdateComponent, canActivate: [AuthGuard]},
  { path: '', component: ElementoFindPageComponent },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElementoRoutingModule { }
