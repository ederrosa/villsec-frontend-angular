import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-overview-video',
  templateUrl: './dialog-overview-video.component.html',
  styleUrls: ['./dialog-overview-video.component.scss']
})
export class DialogOverviewVideoComponent implements OnInit {

  @Input() classCss: string = 'example-margin';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() url: string = '';
  
  constructor(public dialogRef: MatDialogRef<DialogOverviewVideoComponent>) { }

  ngOnInit() {
  }
}
