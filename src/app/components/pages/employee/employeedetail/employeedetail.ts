//#region IMPORT

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../../models/employee.model';
import { EmployeeService } from '../../../../services/employee.service';
import { ToastService } from '../../../../services/toast.service';

//#endregion

//#region INTERFACE

type PageMode = 'add' | 'edit' | 'detail';

//#endregion

//#region COMPONENT

@Component({
    selector: 'app-employeedetail',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './employeedetail.html',
    styleUrl: './employeedetail.scss',
})

//#endregion

//#region CLASS

export class EmployeeDetail implements OnInit {
    //#region ATTRIBUTE

    private readonly fb = inject(FormBuilder);

    private readonly router = inject(Router);

    private readonly route = inject(ActivatedRoute);

    private readonly employeeService = inject(EmployeeService);

    private readonly toastService = inject(ToastService);

    mode: PageMode = 'detail';

    employee?: Employee;

    form!: FormGroup;

    submitted = false;

    groups: string[] = [];

    statuses: string[] = [];

    filteredGroups: string[] = [];

    groupSearch = '';

    showGroupDropdown = false;

    todayStr = new Date().toISOString().slice(0, 16);

    backParams: Record<string, any> = {};

    //#endregion

    //#region GET MODE

    get isAddMode(): boolean {
        return this.mode === 'add';
    }

    get isEditMode(): boolean {
        return this.mode === 'edit';
    }

    get isDetailMode(): boolean {
        return this.mode === 'detail';
    }

    //#endregion

    //#region ON INIT

    ngOnInit(): void {
        this.groups = this.employeeService.groups;

        this.statuses = this.employeeService.statuses;

        this.filteredGroups = [...this.groups];

        this.detectMode();

        this.loadBackParams();

        const id = Number(this.route.snapshot.paramMap.get('id'));

        if (this.isEditMode || this.isDetailMode) {
            const employee = this.employeeService.getById(id);

            if (!employee) {
                this.router.navigate(['/employees']);

                return;
            }

            this.employee = employee;
        }

        if (this.isAddMode || this.isEditMode) {
            this.createForm();
        }

        if (this.isEditMode && this.employee) {
            this.patchForm(this.employee);
        }
    }

    //#endregion

    //#region FUNCTION

    private detectMode(): void {
        const segments = this.route.snapshot.url.map((s) => s.path);

        if (segments.includes('add')) {
            this.mode = 'add';
        } else if (segments.includes('edit')) {
            this.mode = 'edit';
        } else {
            this.mode = 'detail';
        }
    }

    private loadBackParams(): void {
        const queryParams = this.route.snapshot.queryParams;

        this.backParams = {
            name: queryParams['name'] ?? null,

            group: queryParams['group'] ?? null,

            page: queryParams['page'] ? Number(queryParams['page']) : null,

            pageSize: queryParams['pageSize'] ? Number(queryParams['pageSize']) : null,
        };
    }

    private createForm(): void {
        this.form = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],

            firstName: ['', Validators.required],

            lastName: ['', Validators.required],

            email: ['', [Validators.required, Validators.email]],

            birthDate: ['', [Validators.required, this.birthDateValidator]],

            basicSalary: ['', [Validators.required, Validators.min(1)]],

            status: ['', Validators.required],

            group: ['', Validators.required],

            description: ['', Validators.required],
        });
    }

    private patchForm(employee: Employee): void {
        const birthDate = new Date(employee.birthDate).toISOString().slice(0, 16);

        this.form.patchValue({
            username: employee.username,

            firstName: employee.firstName,

            lastName: employee.lastName,

            email: employee.email,

            birthDate,

            basicSalary: employee.basicSalary,

            status: employee.status,

            group: employee.group,

            description: employee.description,
        });

        this.groupSearch = employee.group;
    }

    birthDateValidator(control: AbstractControl) {
        if (!control.value) {
            return null;
        }

        return new Date(control.value) > new Date() ? { futureDate: true } : null;
    }

    formControl(name: string) {
        return this.form.get(name)!;
    }

    isInvalid(name: string): boolean {
        const control = this.formControl(name);

        return control.invalid && (control.touched || this.submitted);
    }

    filterGroups(): void {
        this.filteredGroups = this.groups.filter((group) =>
            group.toLowerCase().includes(this.groupSearch.toLowerCase()),
        );
    }

    openGroupDropdown(): void {
        this.showGroupDropdown = true;

        this.filteredGroups = [...this.groups];
    }

    selectGroup(group: string): void {
        this.form.patchValue({
            group,
        });

        this.groupSearch = group;

        this.showGroupDropdown = false;
    }

    onSave(): void {
        if (this.isDetailMode) {
            return;
        }

        this.submitted = true;

        if (this.form.invalid) {
            this.toastService.show('Please fill in all required fields.', 'danger');

            return;
        }

        const value = this.form.getRawValue();

        const payload = {
            ...value,

            birthDate: new Date(value.birthDate),

            basicSalary: Number(value.basicSalary),
        };

        if (this.isEditMode) {
            this.employeeService.update(this.employee!.id, payload);

            this.toastService.show(
                `"${payload.firstName} ${payload.lastName}" updated successfully`,
                'success',
            );
        } else {
            this.employeeService.add(payload);

            this.toastService.show(
                `"${payload.firstName} ${payload.lastName}" added successfully`,
                'success',
            );
        }

        this.router.navigate(['/employees'], {
            queryParams: this.backParams,
        });
    }

    onCancel(): void {
        this.router.navigate(['/employees'], {
            queryParams: this.backParams,
        });
    }

    goBack(): void {
        this.onCancel();
    }

    formatCurrency(value: number): string {
        return `Rp ${value.toLocaleString('id-ID')}`;
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    }

    //#endregion

    //#region GET

    getAge(date: Date): number {
        const today = new Date();

        const birthDate = new Date(date);

        let age = today.getFullYear() - birthDate.getFullYear();

        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    getBadgeClass(status: string): string {
        const statusMap: Record<string, string> = {
            Active: 'badge-active',

            Inactive: 'badge-inactive',

            'On Leave': 'badge-leave',

            Probation: 'badge-probation',
        };

        return statusMap[status] ?? 'badge-inactive';
    }

    getInitials(employee: Employee): string {
        return (employee.firstName[0] + employee.lastName[0]).toUpperCase();
    }

    //#endregion
}

//#endregion
