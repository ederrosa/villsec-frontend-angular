import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoInsertComponent } from './video-insert/video-insert.component';
import { VideoUpdateComponent } from './video-update/video-update.component';
import { VideoFindPageComponent } from './video-find-page/video-find-page.component';
import { Error404Component } from '../error/error404/error404.component';
import { AuthGuardChild } from 'src/app/core/guards/can-activate-child/auth-guard-child';

const routes: Routes = [
  { path: 'novo', component: VideoInsertComponent, canActivate: [AuthGuardChild]},
  { path: 'editar/:id', component: VideoUpdateComponent, canActivate: [AuthGuardChild]},
  { path: '', component: VideoFindPageComponent},
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
