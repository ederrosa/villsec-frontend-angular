import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './core/home/main/main.component';
import { Error404Component } from './modules/error/error404/error404.component';
import { LoginComponent } from './core/authentication/login/login.component';
import { SeguidorInsertComponent } from './modules/seguidor/seguidor-insert/seguidor-insert.component';
import { AuthGuard } from './core/guards/can-activate/auth-guard';

const routes: Routes = [

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'albuns',
        loadChildren: () => import('./modules/album/album.module').then(m => m.AlbumModule),
        canActivate: [AuthGuard],
      },     
      {
        path: 'eventos',
        loadChildren: () => import('./modules/evento/evento.module').then(m => m.EventoModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'galerias',
        loadChildren: () => import('./modules/galeria/galeria.module').then(m => m.GaleriaModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'musicas',
        loadChildren: () => import('./modules/musica/musica.module').then(m => m.MusicaModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'proprietarios',
        loadChildren: () => import('./modules/proprietario/proprietario.module').then(m => m.ProprietarioModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'seguidores',
        loadChildren: () => import('./modules/seguidor/seguidor.module').then(m => m.SeguidorModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'videos',
        loadChildren: () => import('./modules/video/video.module').then(m => m.VideoModule),
        canActivate: [AuthGuard],
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registrar',
    component: SeguidorInsertComponent,
  },
  {
    path: '**',
    component: Error404Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
