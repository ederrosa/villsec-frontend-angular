import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { RouterModule } from '@angular/router';
import { VideoService } from './video.service';
import { VideoFindPageModule } from './video-find-page/video-find-page.module';
import { VideoInsertModule } from './video-insert/video-insert.module';
import { VideoUpdateModule } from './video-update/video-update.module';
import { VideoCubeDialogOverviewModule } from './video-cube-dialog-overview/video-cube-dialog-overview.module';
import { ErrorModule } from '../error/error.module';

const MODULES_LIST = [
  VideoCubeDialogOverviewModule,
  VideoFindPageModule,
  VideoInsertModule,
  VideoUpdateModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ErrorModule,
    RouterModule,
    VideoRoutingModule,
    ...MODULES_LIST
  ],
  exports: [
    ...MODULES_LIST
  ],
  providers: [
    VideoService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class VideoModule { }
