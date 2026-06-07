//#region IMPORT

import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/shared/navbar/navbar';
import { Toast } from './components/shared/toast/toast';
import { AuthService } from './services/auth.service';

//#endregion

//#region COMPONENT

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Navbar, Toast],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})

//#endregion

//#region CLASS
export class App {
    //#region ATTRIBUTES

    protected readonly title = signal('employee-management');

    public auth = inject(AuthService);

    public router = inject(Router);

    //#endregion
}

//#endregion
