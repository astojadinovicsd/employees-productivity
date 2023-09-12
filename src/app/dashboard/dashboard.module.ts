import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { EditEmployeesDialogComponent } from './edit-employees-dialog/edit-employees-dialog.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { GeneralEmployeesInfoComponent } from './general-employees-info/general-employees-info.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ScrollingModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [
    DashboardComponent,
    GeneralEmployeesInfoComponent,
    EmployeesListComponent,
    EditEmployeesDialogComponent,
    EditEmployeeComponent,
  ],
  exports: [DashboardComponent],
  providers: [
    DashboardService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class DashboardModule {}
