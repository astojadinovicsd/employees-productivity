export interface Employee {
  id: string;
  name: string;
  email: string;
  hourlyRate: number;
  overtimeHourlyRate: number;
}

export interface EmployeeWithShiftDetails extends Employee {
  totalClockedInTime: number;
  totalAmountRegularHours: number;
  totalAmountOvertimeHours: number;
  shifts: ShiftInfo[];
}

export interface ShiftInfo {
  employeeId: string;
  clockInDate: string;
  clockOutDate: string;
}

export interface GeneralEmployeesInfo {
  totalNumberOfEmployees: number;
  totalClockedInTime: number;
  totalAmountRegularHours: number;
  totalAmountOvertimeHours: number;
}
