import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-progress-spinner-overview',
  templateUrl: './progress-spinner-overview.component.html',
  styleUrls: ['./progress-spinner-overview.component.scss']
})
export class ProgressSpinnerOverviewComponent implements OnInit {

  @Input() classCss: string = 'example-margin';
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() color: string = 'primary';
  @Input() mode: string = 'determinate';
  @Input() value: number = 0;
  @Input() diameter: number = 130;
  @Input() strokeWidth: number = 13;

  constructor(
    public dialogRef: MatDialogRef<ProgressSpinnerOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
