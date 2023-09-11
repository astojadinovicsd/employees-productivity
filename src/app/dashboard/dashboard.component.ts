import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  getDatePortionString,
  getHoursDiff,
  getHoursFromStartOfDay,
  getHoursUntilEndOfDay,
  isSameDay,
} from '../core/utils';
import {
  ClockedInTimeAndTotalAmounts,
  Employee,
  EmployeeWithShiftDetails,
  GeneralEmployeesInfo,
  ShiftInfo,
} from './dashboard.model';
import { DashboardService } from './dashboard.service';
import {
  EditEmployeesDialogComponent,
  UpdatedEmployeeData,
} from './edit-employees-dialog/edit-employees-dialog.component';

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
  employeesWithShiftDetails: EmployeeWithShiftDetails[] = [];

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
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
    this.employeesWithShiftDetails = this.mapEmployeesAndShifts(
      this.employees,
      this.shifts
    );
    this.generalEmployeesInfo = this.getGeneralEmployeesInfo(
      this.employeesWithShiftDetails
    );
  }

  mapEmployeesAndShifts(
    employees: Employee[],
    shifts: ShiftInfo[]
  ): EmployeeWithShiftDetails[] {
    const shiftsGroupedByEmployeeId: any = {};
    shifts.forEach(shift => {
      if (shiftsGroupedByEmployeeId[shift.employeeId]) {
        shiftsGroupedByEmployeeId[shift.employeeId].push(shift);
      } else {
        shiftsGroupedByEmployeeId[shift.employeeId] = [shift];
      }
    });

    const employeesWithShiftDetails: EmployeeWithShiftDetails[] = employees.map(
      (employee: Employee) => {
        const shifts = shiftsGroupedByEmployeeId[employee.id] || [];
        const {
          totalClockedInTime,
          totalAmountRegularHours,
          totalAmountOvertimeHours,
        } = this.calculateClockedInTimeAndTotalAmounts(
          shifts,
          employee.hourlyRate,
          employee.overtimeHourlyRate
        );
        return {
          ...employee,
          shifts,
          totalClockedInTime,
          totalAmountRegularHours,
          totalAmountOvertimeHours,
        };
      }
    );

    return employeesWithShiftDetails;
  }

  calculateClockedInTimeAndTotalAmounts(
    shifts: ShiftInfo[],
    hourlyRate: number,
    overtimeHourlyRate: number
  ): ClockedInTimeAndTotalAmounts {
    const totalClockedInTime = this.calcClockedInTIme(shifts);
    const numberOfRegularHours = this.calcNumberOfRegularHours(shifts);
    const numberOfOvertimeHours = totalClockedInTime - numberOfRegularHours;
    const totalAmountRegularHours = numberOfRegularHours * hourlyRate;
    const totalAmountOvertimeHours = numberOfOvertimeHours * overtimeHourlyRate;

    return {
      totalClockedInTime,
      totalAmountRegularHours,
      totalAmountOvertimeHours,
    };
  }

  calcClockedInTIme(shifts: ShiftInfo[]): number {
    let totalHours = 0;
    shifts.forEach(shift => {
      totalHours += getHoursDiff(shift.clockOutDate, shift.clockInDate);
    });
    return totalHours;
  }

  calcNumberOfRegularHours(shifts: ShiftInfo[]): number {
    let totalHours = 0;
    const hoursGroupedByDate: any = {};
    shifts.forEach(shift => {
      if (isSameDay(shift.clockOutDate, shift.clockInDate)) {
        const currentHoursForDate =
          hoursGroupedByDate[getDatePortionString(shift.clockInDate)];
        const hoursDiff = getHoursDiff(shift.clockOutDate, shift.clockInDate);
        hoursGroupedByDate[getDatePortionString(shift.clockInDate)] =
          currentHoursForDate ? currentHoursForDate + hoursDiff : hoursDiff;
      } else {
        const currentHoursForClockInDate =
          hoursGroupedByDate[getDatePortionString(shift.clockInDate)];
        const clockInDateHours = getHoursUntilEndOfDay(shift.clockInDate);
        hoursGroupedByDate[getDatePortionString(shift.clockInDate)] =
          currentHoursForClockInDate
            ? currentHoursForClockInDate + clockInDateHours
            : clockInDateHours;

        const currentHoursForClockOutDate =
          hoursGroupedByDate[getDatePortionString(shift.clockOutDate)];
        const clockOutDateHours = getHoursFromStartOfDay(shift.clockOutDate);
        hoursGroupedByDate[getDatePortionString(shift.clockOutDate)] =
          currentHoursForClockOutDate
            ? currentHoursForClockOutDate + clockOutDateHours
            : clockOutDateHours;
      }
    });

    Object.keys(hoursGroupedByDate).forEach((date: string) => {
      const hours = hoursGroupedByDate[date];
      totalHours += hours > 8 ? 8 : hours;
    });

    return totalHours;
  }

  getGeneralEmployeesInfo(employees: EmployeeWithShiftDetails[]) {
    return {
      totalNumberOfEmployees: employees.length,
      totalClockedInTime: employees.reduce(
        (total, employee) => total + employee.totalClockedInTime,
        0
      ),
      totalAmountRegularHours: employees.reduce(
        (total, employee) => total + employee.totalAmountRegularHours,
        0
      ),
      totalAmountOvertimeHours: employees.reduce(
        (total, employee) => total + employee.totalAmountOvertimeHours,
        0
      ),
    };
  }

  onBulkEdit(employees: EmployeeWithShiftDetails[]) {
    const dialogRef = this.dialog.open(EditEmployeesDialogComponent, {
      data: {
        employees,
      },
      minWidth: 800,
    });

    dialogRef
      .afterClosed()
      .subscribe((updatedEmployeesData?: UpdatedEmployeeData[]) => {
        if (updatedEmployeesData) {
          this.updateAndRecalculateEmployeesWithShiftDetails(
            this.employeesWithShiftDetails,
            updatedEmployeesData
          );
        }
      });
  }

  updateAndRecalculateEmployeesWithShiftDetails(
    employeesWithShiftDetails: EmployeeWithShiftDetails[],
    updatedEmployeesData: UpdatedEmployeeData[]
  ) {
    const employeesWithUpdatedData: EmployeeWithShiftDetails[] =
      employeesWithShiftDetails.map(employee => {
        const employeeUpdatedData = updatedEmployeesData.find(
          (updatedEmployeeData: UpdatedEmployeeData) =>
            updatedEmployeeData.id === employee.id
        );
        return employeeUpdatedData
          ? this.updateAndRecalculateEmployee(employee, employeeUpdatedData)
          : employee;
      });

    this.employeesWithShiftDetails = [...employeesWithUpdatedData];
    this.generalEmployeesInfo = this.getGeneralEmployeesInfo(
      this.employeesWithShiftDetails
    );
    this.cdr.detectChanges();
  }

  updateAndRecalculateEmployee(
    initialEmployeeData: EmployeeWithShiftDetails,
    employeeUpdatedData: UpdatedEmployeeData
  ): EmployeeWithShiftDetails {
    return Object.assign(
      {},
      initialEmployeeData,
      employeeUpdatedData,
      this.calculateClockedInTimeAndTotalAmounts(
        employeeUpdatedData.shifts,
        employeeUpdatedData.hourlyRate,
        employeeUpdatedData.overtimeHourlyRate
      )
    );
  }
}
