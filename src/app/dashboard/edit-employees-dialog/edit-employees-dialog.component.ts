import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeWithShiftDetails, ShiftInfo } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';

export interface EditEmployeesDialogData {
  employees: EmployeeWithShiftDetails[];
}

export interface UpdatedEmployeeData {
  id: string;
  name: string;
  email: string;
  hourlyRate: number;
  overtimeHourlyRate: number;
  shifts: ShiftInfo[];
}

@Component({
  selector: 'ins-edit-employees-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-employees-dialog.component.html',
  styleUrls: ['./edit-employees-dialog.component.scss'],
})
export class EditEmployeesDialogComponent {
  form: FormGroup;
  saving = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: EditEmployeesDialogData,
    public dialogRef: MatDialogRef<EditEmployeesDialogComponent>,
    private fb: FormBuilder,
    private dashboardService: DashboardService
  ) {
    this.form = this.fb.group({
      employees: this.fb.array([]),
    });

    this.data.employees.forEach(employee => this.addEmployeeControl(employee));
  }

  get employees() {
    return this.form.get('employees') as FormArray<FormGroup>;
  }

  addEmployeeControl(employee: EmployeeWithShiftDetails) {
    const employeeGroup = this.fb.group({
      id: [employee.id],
      name: [employee.name, Validators.required],
      email: [employee.email],
      hourlyRate: [employee.hourlyRate, Validators.required],
      overtimeHourlyRate: [employee.overtimeHourlyRate, Validators.required],
      shifts: this.fb.array([]),
    });

    const shiftsFormArray = employeeGroup.get('shifts') as FormArray;
    employee.shifts.forEach(shift =>
      this.addShiftControl(shiftsFormArray, shift)
    );

    this.employees.push(employeeGroup);
  }

  addShiftControl(shiftsFormArray: FormArray, shift: ShiftInfo) {
    const shiftGroup = this.fb.group({
      employeeId: [shift.employeeId],
      clockInDate: [shift.clockInDate, Validators.required],
      clockOutDate: [shift.clockOutDate, Validators.required],
    });

    shiftsFormArray.push(shiftGroup);
  }

  save() {
    const updatedEmployeesData: UpdatedEmployeeData[] =
      this.form.getRawValue().employees;

    this.saving = true;
    this.dashboardService
      .updateEmployees(updatedEmployeesData)
      .subscribe(data => {
        this.saving = false;
        this.dialogRef.close(data);
      });
  }
}
