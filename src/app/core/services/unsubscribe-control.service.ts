import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UnsubscribeControlService {

    constructor() { }

    unsubscribe(theSubscriptionList: Subscription[]): void {
        for (let inscricao of theSubscriptionList) {
           inscricao.unsubscribe();
        }
        this.delete(theSubscriptionList);
    }

    private delete(theSubscriptionList: Subscription[]): void {
        while (theSubscriptionList.length) {
             theSubscriptionList.pop();
        }
    }
}
