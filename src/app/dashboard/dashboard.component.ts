import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Employee,
  EmployeeAllShifts,
  GeneralEmployeesInfo,
  ShiftInfo,
} from './dashboard.model';
import { DashboardService } from './dashboard.service';
import { EditEmployeesDialogComponent } from './edit-employees-dialog/edit-employees-dialog.component';

@Component({
  selector: 'ins-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  shifts: ShiftInfo[] = [];
  generalEmployeesInfo?: GeneralEmployeesInfo;
  employeesAllShifts: EmployeeAllShifts[] = [];

  constructor(
    private dashboardService: DashboardService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.employees = this.dashboardService.getEmployees();
    this.shifts = this.dashboardService.getShifts();
    this.mapDashboardData();
  }

  mapDashboardData() {
    this.employeesAllShifts = this.mapEmployeesAndShifts(
      this.employees,
      this.shifts
    );
    this.generalEmployeesInfo = this.getGeneralEmployeesInfo();
  }

  mapEmployeesAndShifts(
    employees: Employee[],
    shifts: ShiftInfo[]
  ): EmployeeAllShifts[] {
    const shiftsGroupedByEmployeeId: any = {};
    shifts.forEach(shift => {
      if (shiftsGroupedByEmployeeId[shift.employeeId]) {
        shiftsGroupedByEmployeeId[shift.employeeId].push(shift);
      } else {
        shiftsGroupedByEmployeeId[shift.employeeId] = [shift];
      }
    });

    const employeesAllShifts: EmployeeAllShifts[] = employees.map(
      (employee: Employee) => {
        const shifts = shiftsGroupedByEmployeeId[employee.id] || [];
        return {
          ...employee,
          shifts,
          totalClockedInTime: 0,
          totalAmountRegularHours: 0,
          totalAmountOvertimeHours: 0,
        };
      }
    );

    return employeesAllShifts;
  }

  getGeneralEmployeesInfo() {
    return {
      totalNumberOfEmployees: 10,
      totalClockedInTime: 1111,
      totalAmountRegularHours: 2222,
      totalAmountOvertimeHours: 3333,
    };
  }

  onBulkEdit(employees: EmployeeAllShifts[]) {
    this.dialog.open(EditEmployeesDialogComponent, {
      data: {
        employees,
      },
      minWidth: 800,
    });
  }
}
