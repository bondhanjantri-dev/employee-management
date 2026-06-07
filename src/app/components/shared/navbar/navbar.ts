//#region IMPORT

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

//#endregion

//#region COMPONENT

@Component({
    selector: 'app-navbar',
    imports: [],
    templateUrl: './navbar.html',
    styleUrl: './navbar.scss',
})

//#endregion

//#region CLASS
export class Navbar {
    
    //#region ATTRIBUTES

    public auth = inject(AuthService);

    private router = inject(Router);

    //#endregion

    //#region FUNCTION

    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }

    //#endregion
}

//#endregion
