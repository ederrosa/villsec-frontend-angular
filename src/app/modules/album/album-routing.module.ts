import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumInsertComponent } from './album-insert/album-insert.component';
import { AlbumUpdateComponent } from './album-update/album-update.component';
import { AlbumFindPageComponent } from './album-find-page/album-find-page.component';
import { Error404Component } from '../error/error404/error404.component';
import { AuthGuard } from 'src/app/core/guards/can-activate/auth-guard';

const routes: Routes = [
  { path: 'novo', component: AlbumInsertComponent, canActivate: [AuthGuard]},
  { path: 'editar/:id', component: AlbumUpdateComponent, canActivate: [AuthGuard]},
  { path: '', component: AlbumFindPageComponent },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumRoutingModule { }
