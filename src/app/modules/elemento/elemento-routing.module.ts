import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElementoInsertComponent } from './elemento-insert/elemento-insert.component';
import { ElementoUpdateComponent } from './elemento-update/elemento-update.component';
import { ElementoFindPageComponent } from './elemento-find-page/elemento-find-page.component';
import { Error404Component } from '../error/error404/error404.component';


const routes: Routes = [
  { path: 'novo', component: ElementoInsertComponent},
  { path: 'editar/:id', component: ElementoUpdateComponent},
  { path: '', component: ElementoFindPageComponent },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElementoRoutingModule { }
