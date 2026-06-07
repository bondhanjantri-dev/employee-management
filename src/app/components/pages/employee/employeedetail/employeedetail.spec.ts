import { EmployeeDetail } from './employeedetail';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('EmployeeDetail', () => {
    let component: EmployeeDetail;
    let fixture: ComponentFixture<EmployeeDetail>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EmployeeDetail],
        }).compileComponents();

        fixture = TestBed.createComponent(EmployeeDetail);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
