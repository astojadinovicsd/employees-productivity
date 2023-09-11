import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { delay, of } from 'rxjs';
import { EmployeeWithShiftDetails, ShiftInfo } from '../dashboard.model';

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
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      employees: this.fb.array([]),
    });

    this.data.employees.forEach(employee => this.addEmployeeContorl(employee));
  }

  get employees() {
    return this.form.get('employees') as FormArray<FormGroup>;
  }

  addEmployeeContorl(employee: EmployeeWithShiftDetails) {
    const employeeGroup = this.fb.group({
      id: [employee.id],
      name: [employee.name, Validators.required],
      email: [employee.email],
      hourlyRate: [employee.hourlyRate, Validators.required],
      overtimeHourlyRate: [employee.overtimeHourlyRate, Validators.required],
      shifts: [employee.shifts],
    });
    this.employees.push(employeeGroup);
  }

  save() {
    const updatedEmployeesData: UpdatedEmployeeData[] =
      this.form.getRawValue().employees;

    const fakeApiCall = of(updatedEmployeesData).pipe(delay(300));

    this.saving = true;
    fakeApiCall.subscribe(data => {
      this.saving = false;
      this.dialogRef.close(data);
    });
  }
}
