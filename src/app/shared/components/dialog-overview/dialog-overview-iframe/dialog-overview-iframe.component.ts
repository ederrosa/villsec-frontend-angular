import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-overview-iframe',
  templateUrl: './dialog-overview-iframe.component.html',
  styleUrls: ['./dialog-overview-iframe.component.scss']
})
export class DialogOverviewIframeComponent implements OnInit {

  @Input() classCss: string = 'example-margin';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() url: string = '';

  constructor(public dialogRef: MatDialogRef<DialogOverviewIframeComponent>) { }

  ngOnInit(): void {  }
}
