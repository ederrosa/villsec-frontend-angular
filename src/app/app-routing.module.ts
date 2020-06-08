import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './core/home/main/main.component';
import { Error404Component } from './modules/error/error404/error404.component';


const routes: Routes = [

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'albuns',
        loadChildren: () => import('./modules/album/album.module').then(m => m.AlbumModule)
      },
      {
        path: 'eventos',
        loadChildren: () => import('./modules/evento/evento.module').then(m => m.EventoModule)
      },
      {
        path: 'elementos',
        loadChildren: () => import('./modules/elemento/elemento.module').then(m => m.ElementoModule)
      },
      {
        path: 'musicas',
        loadChildren: () => import('./modules/musica/musica.module').then(m => m.MusicaModule)
      },
      {
        path: 'proprietarios',
        loadChildren: () => import('./modules/proprietario/proprietario.module').then(m => m.ProprietarioModule)
      },
      {
        path: 'seguidores',
        loadChildren: () => import('./modules/seguidor/seguidor.module').then(m => m.SeguidorModule)
      },
    ]
  },
  {
    path: '**',
    component: Error404Component,
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
