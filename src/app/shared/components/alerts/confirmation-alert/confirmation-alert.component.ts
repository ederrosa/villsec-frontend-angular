import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-alert',
  templateUrl: './confirmation-alert.component.html',
  styleUrls: ['./confirmation-alert.component.scss']
})
export class ConfirmationAlertComponent implements OnInit {

    @Input() classCss: string = '';
    @Input() title: string = '';
    @Input() message: string = '';
    @Input() subTitle: string = '';
    @Input() btnConfirm: string = 'Confirmar!';
    @Input() btnCancel: string = 'Cancelar';
    @Input() urlNavigate: string = '';

    constructor(
        public dialogRef: MatDialogRef<ConfirmationAlertComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private theRouter: Router
    ) { }

    ngOnInit() {
    }

    onConfirm(): void {
        if (this.urlNavigate != '') {
            this.theRouter.navigate([this.urlNavigate]);
            this.dialogRef.close();
        } else {
            this.dialogRef.close();
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
