export interface Employee {
  id: string;
  name: string;
  email: string;
  hourlyRate: number;
  overtimeHourlyRate: number;
}

export interface EmployeeWithShiftDetails
  extends Employee,
    ClockedInTimeAndTotalAmounts {
  shifts: ShiftInfo[];
}

export interface ShiftInfo {
  employeeId: string;
  clockInDate: string;
  clockOutDate: string;
}

export interface GeneralEmployeesInfo extends ClockedInTimeAndTotalAmounts {
  totalNumberOfEmployees: number;
}

export interface ClockedInTimeAndTotalAmounts {
  totalClockedInTime: number;
  totalAmountRegularHours: number;
  totalAmountOvertimeHours: number;
}
