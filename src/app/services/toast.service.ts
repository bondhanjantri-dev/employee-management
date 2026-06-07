//#region IMPORT

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

//#endregion

//#region INTERFACE

export interface ToastInterface {
    message: string;
    type: 'success' | 'warning' | 'danger' | 'info';
}

//#endregion

//#region INJECTABLE

@Injectable({
    providedIn: 'root',
})

//#endregion

//#region CLASS
export class ToastService {
    private toastSubject = new Subject<ToastInterface>();

    toast$ = this.toastSubject.asObservable();

    show(message: string, type: ToastInterface['type'] = 'info'): void {
        this.toastSubject.next({
            message,
            type,
        });
    }
}

//#endregion
