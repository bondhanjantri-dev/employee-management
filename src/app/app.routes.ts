//#region IMPORT

import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

//#endregion

//#region ROUTES

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },

    // LOGIN
    {
        path: 'login',
        loadComponent: () => import('./components/pages/login/login').then((c) => c.Login),
    },

    // LIST EMPLOYEE
    {
        path: 'employees',
        canActivate: [AuthGuard],
        loadComponent: () =>
            import('./components/pages/employee/employeelist/employeelist').then(
                (c) => c.EmployeeList,
            ),
    },

    // ADD EMPLOYEE
    {
        path: 'employees/add',
        canActivate: [AuthGuard],
        loadComponent: () =>
            import('./components/pages/employee/employeedetail/employeedetail').then(
                (c) => c.EmployeeDetail,
            ),
    },

    // DETAIL EMPLOYEE
    {
        path: 'employees/:id',
        canActivate: [AuthGuard],
        loadComponent: () =>
            import('./components/pages/employee/employeedetail/employeedetail').then(
                (c) => c.EmployeeDetail,
            ),
    },

    // EDIT EMPLOYEE
    {
        path: 'employees/:id/edit',
        canActivate: [AuthGuard],
        loadComponent: () =>
            import('./components/pages/employee/employeedetail/employeedetail').then(
                (c) => c.EmployeeDetail,
            ),
    },

    {
        path: '**',
        redirectTo: 'login',
    },
];

//#endregion
