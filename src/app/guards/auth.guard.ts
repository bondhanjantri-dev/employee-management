//#region IMPORT

import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

//#endregion


//#region INJECTABLE

@Injectable({ providedIn: 'root' })

//#endregion


//#region CLASS

export class AuthGuard implements CanActivate
{ 
    private auth = inject(AuthService);

    private router = inject(Router);

    //#region FUNCTION

    canActivate(): boolean
    {
        if (this.auth.isLoggedIn()) {return true;}
        this.router.navigate(['/login']);
        return false;
    }

    //#endregion

}

//#endregion