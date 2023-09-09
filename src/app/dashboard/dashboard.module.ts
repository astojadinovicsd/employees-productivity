import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { GeneralEmployeesInfoComponent } from './general-employees-info/general-employees-info.component';

@NgModule({
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatButtonModule],
  declarations: [
    DashboardComponent,
    GeneralEmployeesInfoComponent,
    EmployeesListComponent,
  ],
  exports: [DashboardComponent],
  providers: [DashboardService],
})
export class DashboardModule {}
