import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeAllShifts } from '../dashboard.model';

export interface EditEmployeesDialogData {
  employees: EmployeeAllShifts[];
}

@Component({
  selector: 'ins-edit-employees-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-employees-dialog.component.html',
  styleUrls: ['./edit-employees-dialog.component.scss'],
})
export class EditEmployeesDialogComponent {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: EditEmployeesDialogData,
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

  addEmployeeContorl(employee: EmployeeAllShifts) {
    const employeeGroup = this.fb.group({
      name: [employee.name, Validators.required],
      email: [employee.email],
      hourlyRate: [employee.hourlyRate, Validators.required],
      overtimeHourlyRate: [employee.overtimeHourlyRate, Validators.required],
    });
    this.employees.push(employeeGroup);
  }
}
