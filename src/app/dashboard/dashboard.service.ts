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

@Injectable()
export class DashboardService {
  getEmployees(): Observable<Employee[]> {
    const employees = [
      {
        id: 'asdf1',
        name: 'Bogdan Bogdanovic',
        email: 'a@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
      {
        id: 'asdf2',
        name: 'Aleksa Avramovic',
        email: 's@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
      {
        id: 'asdf3',
        name: 'Dejan Davidovac',
        email: 'd@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
      {
        id: 'asdf4',
        name: 'Ognjen Dobric',
        email: 'f@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
      {
        id: 'asdf5',
        name: 'Marko Guduric',
        email: 'g@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
      {
        id: 'asdf6',
        name: 'Nikola Jovic',
        email: 'h@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
      {
        id: 'asdf7',
        name: 'Stefan Jovic',
        email: 'j@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
      {
        id: 'asdf8',
        name: 'Vanja Marinkovic',
        email: 'k@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
      {
        id: 'asdf9',
        name: 'Nikola Milutinov',
        email: 'l@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
      {
        id: 'asdf10',
        name: 'Filip Petrusev',
        email: 'q@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
      {
        id: 'asdf11',
        name: 'Dusan Ristic',
        email: 'w@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
      {
        id: 'asdf12',
        name: 'Borisa Simanic',
        email: 'e@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
    ];

    return of(employees).pipe(delay(300));
  }

  getShifts(): Observable<ShiftInfo[]> {
    const shifts = [
      {
        employeeId: 'asdf1',
        clockInDate: '2023-09-08T14:00:00',
        clockOutDate: '2023-09-08T17:00:00',
      },
      {
        employeeId: 'asdf1',
        clockInDate: '2023-09-08T18:00:00',
        clockOutDate: '2023-09-08T20:00:00',
      },
      {
        employeeId: 'asdf1',
        clockInDate: '2023-09-08T18:00:00',
        clockOutDate: '2023-09-09T03:00:00',
      },
      {
        employeeId: 'asdf2',
        clockInDate: '2023-09-08T14:00:00',
        clockOutDate: '2023-09-08T17:00:00',
      },
      {
        employeeId: 'asdf2',
        clockInDate: '2023-09-08T18:00:00',
        clockOutDate: '2023-09-08T20:00:00',
      },
    ];
    return of(shifts).pipe(delay(500));
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
