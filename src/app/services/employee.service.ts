//#region IMPORT

import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';

//#endregion


//#region CONT DUMMY

const GROUPS =
[
    'Engineering', 'Marketing', 'Finance', 'Human Resources',
    'Operations', 'Sales', 'Design', 'Legal', 'Customer Support', 'Product'
];

const STATUSES = ['Active', 'Inactive', 'On Leave', 'Probation'];

//#endregion


//#region RAND ITEM

function randItem<T>(arr: T[]): T
{ 
    return arr[Math.floor(Math.random() * arr.length)];
}

function randDate(start: Date, end: Date): Date
{
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

//#endregion


//#region FUNCTION

function generateEmployees(): Employee[] {
    const firstNames = ['Budi','Siti','Ahmad','Dewi','Rizky','Putri','Andi','Nurul','Dani','Reni',
        'Agus','Maya','Fajar','Indah','Hendra','Wati','Bayu','Lina','Yoga','Ayu',
        'Dimas','Sari','Reza','Fitri','Irfan','Dian','Hadi','Nia','Galih','Tuti',
        'Rafi','Nanda','Kevin','Diana','Gilang','Rina','Farhan','Mega','Hafiz','Yuni'];
    const lastNames = ['Santoso','Wijaya','Susanto','Pratama','Kusuma','Setiawan','Hartono','Rahayu',
        'Saputra','Hidayat','Nugroho','Permata','Utama','Purnama','Wibowo','Suharto',
        'Mahendra','Lestari','Prasetyo','Siregar','Halim','Gunawan','Salim','Hermawan',
        'Mulyadi','Sukma','Kartika','Novita','Putra','Dewi'];

    return Array.from({ length: 120 }, (_, i) => {
        const firstName = randItem(firstNames);
        const lastName = randItem(lastNames);
        const birthDate = randDate(new Date(1975, 0, 1), new Date(2000, 11, 31));
        return {
            id: i + 1,
            username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}`,
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@company.com`,
            birthDate,
            basicSalary: Math.floor(Math.random() * 18000000) + 5000000,
            status: randItem(STATUSES),
            group: randItem(GROUPS),
            description: `Employee record created on ${new Date(2020 + Math.floor(Math.random()*4), Math.floor(Math.random()*12), 1).toLocaleDateString('id-ID')}`,
        };
    });
}

//#endregion

//#region INJECTABLE

@Injectable({ providedIn: 'root' })

//#endregion


//#region CLASS

export class EmployeeService
{
    private employees: Employee[] = generateEmployees();

    readonly groups = GROUPS;

    readonly statuses = STATUSES;


    //#region GETTER

    getAll(): Employee[]
    {
        return [...this.employees];
    }

    getById(id: number): Employee | undefined
    {
        return this.employees.find(e => e.id === id);
    }

    //#endregion


    //#region ADD

    add(emp: Omit<Employee, 'id'>): Employee
    {
        const newEmp = { ...emp, id: Math.max(...this.employees.map(e => e.id)) + 1 };
        this.employees.unshift(newEmp);
        return newEmp;
    }

    //#endregion


    //#region UPDATE

    update(id: number, data: Omit<Employee, 'id'>): Employee | null
    {
        const idx = this.employees.findIndex(e => e.id === id);
        if (idx === -1) {return null;}
        this.employees[idx] = { ...data, id };
        return this.employees[idx];
    }

    //#endregion


    //#region DELETE

    delete(id: number): void
    {
        this.employees = this.employees.filter(e => e.id !== id);
    }

    //#endregion
}

//#endregion