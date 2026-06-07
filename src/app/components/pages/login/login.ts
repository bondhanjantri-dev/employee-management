//#region IMPORT

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

//#endregion

//#region COMPONENT

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})

//#endregion

//#region CLASS
export class Login implements OnInit {

    //#region ATTRIBUTES

    private readonly auth = inject(AuthService);

    private readonly router = inject(Router);

    username = '';

    password = '';

    showPassword = false;

    error = '';

    loading = false;

    //#endregion

    //#region ON INIT

    ngOnInit(): void {
        if (this.auth.isLoggedIn()) {
            this.router.navigate(['/employees']);
        }
    }

    //#endregion

    //#region FUNCTION

    onSubmit(): void {
        if (!this.username || !this.password) {
            this.error = 'Please fill in all fields.';
            return;
        }

        this.loading = true;
        this.error = '';

        setTimeout(() => {
            const success = this.auth.login(this.username, this.password);

            if (success) {
                this.router.navigate(['/employees']);
                return;
            }

            this.error = 'Invalid username or password.';
            this.loading = false;
        }, 600);
    }

    //#endregion
}

//#endregion
