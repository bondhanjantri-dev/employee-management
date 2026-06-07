//#region IMPORT

import { Injectable } from '@angular/core';

//#endregion


//#region INJECT

@Injectable({ providedIn: 'root' })

//#endregion


//#region CLASS

export class AuthService
{
    private readonly USERS =
        [
            { username: 'admin', password: 'admin123', name: 'Administrator' },
            { username: 'hr', password: 'hr123', name: 'HR Manager' },
        ];

    //#region GETTER

    getCurrentUser(): any
    {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    //#endregion


    //#region FUNCTION

    login(username: string, password: string): boolean
    {
        const user = this.USERS.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    }

    logout(): void
    {
        localStorage.removeItem('currentUser');
    }

    isLoggedIn(): boolean
    {
        return !!localStorage.getItem('currentUser');
    }

    //#endregion

}


//#endregion