//#region IMPORT

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Employee } from '../../../../models/employee.model';
import { EmployeeService } from '../../../../services/employee.service';
import { ToastService } from '../../../../services/toast.service';

//#endregion

//#region COMPONENT

@Component({
    selector: 'app-employeelist',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './employeelist.html',
    styleUrl: './employeelist.scss',
})

//#endregion

//#region CLASS
export class EmployeeList implements OnInit {

    //#region ATTRIBUTES

    private empService = inject(EmployeeService);

    private toastService = inject(ToastService);

    private router = inject(Router);

    private route = inject(ActivatedRoute);

    Math = Math;

    allEmployees: Employee[] = [];

    filtered: Employee[] = [];

    paged: Employee[] = [];

    searchName = '';

    searchGroup = '';

    sortField: keyof Employee = 'id';

    sortDir: 'asc' | 'desc' = 'asc';

    page = 1;

    pageSize = 10;

    totalPages = 1;

    pageSizeOptions = [5, 10, 20, 50];

    groups: string[] = [];

    //#endregion

    //#region ON INIT

    ngOnInit(): void {
        this.allEmployees = this.empService.getAll();
        this.groups = this.empService.groups;

        this.route.queryParams.subscribe((params) => {
            this.searchName = params['name'] ?? '';
            this.searchGroup = params['group'] ?? '';
            this.page = Number(params['page']) || 1;
            this.pageSize = Number(params['pageSize']) || 10;

            this.applyFilter();
        });
    }

    //#endregion

    //#region FUNCTION

    applyFilter(): void {
        let data = [...this.allEmployees];

        const name = this.searchName.trim().toLowerCase();
        const group = this.searchGroup.trim().toLowerCase();

        if (name) {
            data = data.filter(
                (e) =>
                    e.firstName.toLowerCase().includes(name) ||
                    e.lastName.toLowerCase().includes(name) ||
                    e.username.toLowerCase().includes(name),
            );
        }

        if (group) {
            data = data.filter((e) => e.group.toLowerCase().includes(group));
        }

        data.sort((a, b) => {
            const av = a[this.sortField];
            const bv = b[this.sortField];

            const cmp = av < bv ? -1 : av > bv ? 1 : 0;

            return this.sortDir === 'asc' ? cmp : -cmp;
        });

        this.filtered = data;

        this.totalPages = Math.max(1, Math.ceil(data.length / this.pageSize));

        if (this.page > this.totalPages) {
            this.page = 1;
        }

        this.updatePaged();
        this.updateQueryParams();
    }

    updatePaged(): void {
        const start = (this.page - 1) * this.pageSize;
        this.paged = this.filtered.slice(start, start + this.pageSize);
    }

    sort(field: keyof Employee): void {
        if (this.sortField === field) {
            this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDir = 'asc';
        }

        this.applyFilter();
    }

    goPage(page: number): void {
        if (page < 1 || page > this.totalPages) {
            return;
        }

        this.page = page;
        this.updatePaged();
        this.updateQueryParams();
    }

    onPageSizeChange(): void {
        this.page = 1;
        this.applyFilter();
    }

    updateQueryParams(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                name: this.searchName || null,
                group: this.searchGroup || null,
                page: this.page,
                pageSize: this.pageSize,
            },
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

    getQueryParams() {
        return {
            name: this.searchName || null,
            group: this.searchGroup || null,
            page: this.page,
            pageSize: this.pageSize,
        };
    }

    onSearch(): void {
        this.page = 1;
        this.applyFilter();
    }

    clearSearch(): void {
        this.searchName = '';
        this.searchGroup = '';
        this.onSearch();
    }

    viewDetail(id: number): void {
        this.router.navigate(['/employees', id], {
            queryParams: this.getQueryParams(),
        });
    }

    onEdit(employee: Employee): void {
        this.router.navigate(['/employees', employee.id, 'edit'], {
            queryParams: this.getQueryParams(),
        });
    }

    onDelete(employee: Employee): void {
        this.toastService.show(`Deleted "${employee.firstName} ${employee.lastName}"`, 'danger');

        this.empService.delete(employee.id);

        this.allEmployees = this.empService.getAll();

        this.applyFilter();
    }

    getPages(): number[] {
        const pages: number[] = [];

        const start = Math.max(1, this.page - 2);
        const end = Math.min(this.totalPages, this.page + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }

    getSortIcon(field: keyof Employee): string {
        if (this.sortField !== field) {
            return '↕';
        }

        return this.sortDir === 'asc' ? '↑' : '↓';
    }

    getBadgeClass(status: string): string {
        const map: Record<string, string> = {
            Active: 'badge-active',
            Inactive: 'badge-inactive',
            'On Leave': 'badge-leave',
            Probation: 'badge-probation',
        };

        return map[status] || 'badge-inactive';
    }

    formatCurrency(value: number): string {
        return `Rp ${value.toLocaleString('id-ID')}`;
    }

    //#endregion
}

//#endregion
