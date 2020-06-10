import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MusicaInsertComponent } from './musica-insert/musica-insert.component';
import { MusicaUpdateComponent } from './musica-update/musica-update.component';
import { MusicaFindPageComponent } from './musica-find-page/musica-find-page.component';
import { Error404Component } from '../error/error404/error404.component';
import { AuthGuard } from 'src/app/core/guards/can-activate/auth-guard';

const routes: Routes = [
  { path: 'novo', component: MusicaInsertComponent, canActivate: [AuthGuard]},
  { path: 'editar/:id', component: MusicaUpdateComponent, canActivate: [AuthGuard]},
  { path: '', component: MusicaFindPageComponent },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusicaRoutingModule { }
