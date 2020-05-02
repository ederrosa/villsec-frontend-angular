import { Injectable } from '@angular/core';
import { ILocalUser } from 'src/app/shared/models/domain/ilocal-user';
import { STORAGE_KEYS } from 'src/configurations/storage_keys.configuration';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }

    getLocalUser(): ILocalUser {
        let theUser = sessionStorage.getItem(STORAGE_KEYS.localUser);
        if (theUser == null) {
            return null;
        } else {
            return JSON.parse(theUser);
        }

    }

    setLocalUser(theUser: ILocalUser) {
        if (theUser == null) {
            sessionStorage.removeItem(STORAGE_KEYS.localUser);
        } else {
            sessionStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(theUser));
        }
    }
}
