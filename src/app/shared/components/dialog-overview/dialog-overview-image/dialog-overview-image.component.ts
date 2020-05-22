import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-overview-image',
  templateUrl: './dialog-overview-image.component.html',
  styleUrls: ['./dialog-overview-image.component.scss']
})
export class DialogOverviewImageComponent implements OnInit {

  @Input() classCss: string = 'example-margin';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() url: string = '';
  @Input() descricao: string = '';

  constructor(public dialogRef: MatDialogRef<DialogOverviewImageComponent>) { }

  ngOnInit(): void {
  }

}
