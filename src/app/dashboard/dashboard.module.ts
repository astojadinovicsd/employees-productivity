import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { GeneralEmployeesInfoComponent } from './general-employees-info/general-employees-info.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [DashboardComponent, GeneralEmployeesInfoComponent],
  exports: [DashboardComponent],
  providers: [DashboardService],
})
export class DashboardModule {}
