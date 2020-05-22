import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-overview-audio',
  templateUrl: './dialog-overview-audio.component.html',
  styleUrls: ['./dialog-overview-audio.component.scss']
})
export class DialogOverviewAudioComponent implements OnInit {

  @Input() classCss: string = 'example-margin';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() url: string = '';

  constructor(public dialogRef: MatDialogRef<DialogOverviewAudioComponent>) { }

  ngOnInit(): void {
  }

}
