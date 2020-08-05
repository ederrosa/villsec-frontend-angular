import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImagemInsertComponent } from './imagem-insert/imagem-insert.component';
import { ImagemUpdateComponent } from './imagem-update/imagem-update.component';
import { ImagemFindPageComponent } from './imagem-find-page/imagem-find-page.component';
import { Error404Component } from '../error/error404/error404.component';
import { AuthGuardChild } from 'src/app/core/guards/can-activate-child/auth-guard-child';

const routes: Routes = [
  { path: 'novo', component: ImagemInsertComponent, canActivate: [AuthGuardChild]},
  { path: 'editar/:id', component: ImagemUpdateComponent, canActivate: [AuthGuardChild]},
  { path: '', component: ImagemFindPageComponent},
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImagemRoutingModule { }
