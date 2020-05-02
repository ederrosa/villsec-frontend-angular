import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-informative-alert',
    templateUrl: './informative-alert.component.html',
    styleUrls: ['./informative-alert.component.scss']
})
export class InformativeAlertComponent implements OnInit {

    @Input() classCss;
    @Input() title: string = '';
    @Input() message: string = '';
    @Input() subTitle: string = '';
    @Input() btnMessage: string = 'OK !';
    @Input() urlNavigate: string = '';
    
    constructor(
        public dialogRef: MatDialogRef<InformativeAlertComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private theRouter: Router
    ) { }

    ngOnInit() {
    }

    onOk(): void {
        if (this.urlNavigate != '') {
            this.theRouter.navigate([this.urlNavigate]);
            this.dialogRef.close();
        } else {
            this.dialogRef.close();
        }
    }
}
