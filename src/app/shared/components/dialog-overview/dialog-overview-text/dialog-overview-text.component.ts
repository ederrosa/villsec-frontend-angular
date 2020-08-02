import { Component, OnInit, Input } from '@angular/core';
import { DialogOverviewImageComponent } from '../dialog-overview-image/dialog-overview-image.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-overview-text',
  templateUrl: './dialog-overview-text.component.html',
  styleUrls: ['./dialog-overview-text.component.scss']
})
export class DialogOverviewTextComponent implements OnInit {

  @Input() classCss: string = 'example-margin';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() text: string = '';

  constructor(public dialogRef: MatDialogRef<DialogOverviewImageComponent>) { }

  ngOnInit(): void {
  }

}
