import { Injectable } from '@angular/core';
import { Employee, ShiftInfo } from './dashboard.model';

@Injectable()
export class DashboardService {
  getEmployees(): Employee[] {
    return [
      {
        id: 'asdf1',
        name: 'Bogdan Bogdanovic',
        email: 'a@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
      {
        id: 'asdf2',
        name: 'Nikola Milutinov',
        email: 'b@f.com',
        hourlyRate: 100,
        overtimeHourlyRate: 200,
      },
    ];
  }

  getShifts(): ShiftInfo[] {
    return [
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
  }
}
