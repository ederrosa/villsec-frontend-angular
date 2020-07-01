import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GaleriaInsertComponent } from './galeria-insert/galeria-insert.component';
import { GaleriaUpdateComponent } from './galeria-update/galeria-update.component';
import { GaleriaFindPageComponent } from './galeria-find-page/galeria-find-page.component';
import { Error404Component } from '../error/error404/error404.component';

const routes: Routes = [
  { path: 'novo', component:GaleriaInsertComponent},
  { path: 'editar/:id', component:GaleriaUpdateComponent},
  { path: '', component:GaleriaFindPageComponent},
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GaleriaRoutingModule { }
