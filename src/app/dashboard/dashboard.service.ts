import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
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
  ShiftInfo,
} from './dashboard.model';
import { UpdatedEmployeeData } from './edit-employees-dialog/edit-employees-dialog.component';
import { employeesMock, shiftsMock } from './mock-data';

@Injectable()
export class DashboardService {
  getEmployees(): Observable<Employee[]> {
    return of(employeesMock).pipe(delay(300));
  }

  getShifts(): Observable<ShiftInfo[]> {
    return of(shiftsMock).pipe(delay(500));
  }

  updateEmployees(
    updatedEmployeesData: UpdatedEmployeeData[]
  ): Observable<UpdatedEmployeeData[]> {
    return of(updatedEmployeesData).pipe(delay(300));
  }

  mapEmployeesAndShifts(
    employees: Employee[],
    shifts: ShiftInfo[]
  ): EmployeeWithShiftDetails[] {
    const shiftsGroupedByEmployeeId = this.getShiftsGroupedByEmployeeId(shifts);

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

  getUpdatedEmployeesWithShiftDetails(
    employeesWithShiftDetails: EmployeeWithShiftDetails[],
    updatedEmployeesData: UpdatedEmployeeData[]
  ): EmployeeWithShiftDetails[] {
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

    return employeesWithUpdatedData;
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

  private updateAndRecalculateEmployee(
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

  private getShiftsGroupedByEmployeeId(shifts: ShiftInfo[]): {
    [key: string]: ShiftInfo[];
  } {
    const shiftsGroupedByEmployeeId: any = {};
    shifts.forEach(shift => {
      if (shiftsGroupedByEmployeeId[shift.employeeId]) {
        shiftsGroupedByEmployeeId[shift.employeeId].push(shift);
      } else {
        shiftsGroupedByEmployeeId[shift.employeeId] = [shift];
      }
    });

    return shiftsGroupedByEmployeeId;
  }

  private calculateClockedInTimeAndTotalAmounts(
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

  private calcClockedInTIme(shifts: ShiftInfo[]): number {
    let totalHours = 0;
    shifts.forEach(shift => {
      totalHours += getHoursDiff(shift.clockOutDate, shift.clockInDate);
    });
    return totalHours;
  }

  private calcNumberOfRegularHours(shifts: ShiftInfo[]): number {
    let totalHours = 0;
    const hoursGroupedByDate = this.getHoursGroupedByDate(shifts);

    Object.keys(hoursGroupedByDate).forEach((date: string) => {
      const hours = hoursGroupedByDate[date];
      totalHours += hours > 8 ? 8 : hours;
    });

    return totalHours;
  }

  private getHoursGroupedByDate(shifts: ShiftInfo[]): {
    [key: string]: number;
  } {
    const hoursGroupedByDate: any = {};
    shifts.forEach(shift => {
      if (isSameDay(shift.clockOutDate, shift.clockInDate)) {
        // if clockOutDate and clockInDate are same day
        // for this date we add hours difference of these two
        const key = getDatePortionString(shift.clockInDate);
        hoursGroupedByDate[key] = this.updateHoursGroupedByDate(
          hoursGroupedByDate,
          key,
          getHoursDiff(shift.clockOutDate, shift.clockInDate)
        );
      } else {
        // if clockOutDate and clockInDate are NOT the same day
        // this means that employee started shift on one day and finished on the next day

        // we add hours from clockInDate until midnight
        const key1 = getDatePortionString(shift.clockInDate);
        hoursGroupedByDate[key1] = this.updateHoursGroupedByDate(
          hoursGroupedByDate,
          key1,
          getHoursUntilEndOfDay(shift.clockInDate)
        );

        // we add hours from midnight of the next day until clockOutDate
        const key2 = getDatePortionString(shift.clockOutDate);
        hoursGroupedByDate[key2] = this.updateHoursGroupedByDate(
          hoursGroupedByDate,
          key2,
          getHoursFromStartOfDay(shift.clockOutDate)
        );
      }
    });
    return hoursGroupedByDate;
  }

  private updateHoursGroupedByDate(
    hoursGroupedByDateObject: any,
    key: string,
    hoursToBeAdded: number
  ): number {
    const currentHoursForDate = hoursGroupedByDateObject[key];
    return currentHoursForDate
      ? currentHoursForDate + hoursToBeAdded
      : hoursToBeAdded;
  }
}
