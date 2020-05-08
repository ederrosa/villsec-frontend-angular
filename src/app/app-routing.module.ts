import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './core/home/main/main.component';


const routes: Routes = [

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'albuns',
        loadChildren: () => import('./modules/album/album.module').then(m => m.AlbumModule)
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
