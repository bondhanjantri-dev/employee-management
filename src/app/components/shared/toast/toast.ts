//#region IMPORT

import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastInterface } from '../../../services/toast.service';

//#endregion

//#region INTERFACE

interface ToastItem extends ToastInterface {
    id: number;
}

//#endregion

//#region COMPONENT
@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.html',
    styleUrl: './toast.scss',
})

//#endregion

//#region CLASS
export class Toast implements OnInit, OnDestroy {
    //#region ATTRIBUTES

    toasts = signal<ToastItem[]>([]);

    private subscription?: Subscription;

    private counter = 0;

    private toastService = inject(ToastService);

    //#endregion

    //#region ON INIT

    ngOnInit(): void {
        this.subscription = this.toastService.toast$.subscribe((toast) => {
            const id = ++this.counter;

            this.toasts.update((list) => [
                ...list,
                {
                    ...toast,
                    id,
                },
            ]);

            setTimeout(() => {
                this.remove(id);
            }, 2000);
        });
    }

    //#endregion

    //#region FUNCTION

    remove(id: number): void {
        this.toasts.update((list) => list.filter((t) => t.id !== id));
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    //#endregion
}
