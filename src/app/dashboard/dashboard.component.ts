import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import {
  Employee,
  EmployeeWithShiftDetails,
  GeneralEmployeesInfo,
  ShiftInfo,
} from './dashboard.model';
import { DashboardService } from './dashboard.service';
import {
  EditEmployeesDialogComponent,
  UpdatedEmployeeData,
} from './edit-employees-dialog/edit-employees-dialog.component';

@Component({
  selector: 'ins-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  generalEmployeesInfo?: GeneralEmployeesInfo;
  employeesWithShiftDetails: EmployeeWithShiftDetails[] = [];

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    forkJoin({
      allEmployees: this.dashboardService.getEmployees(),
      allShifts: this.dashboardService.getShifts(),
    }).subscribe(({ allEmployees, allShifts }) => {
      this.mapDashboardData(allEmployees, allShifts);
    });
  }

  mapDashboardData(allEmployees: Employee[], allShifts: ShiftInfo[]) {
    this.employeesWithShiftDetails =
      this.dashboardService.mapEmployeesAndShifts(allEmployees, allShifts);
    this.generalEmployeesInfo = this.dashboardService.getGeneralEmployeesInfo(
      this.employeesWithShiftDetails
    );
    this.cdr.detectChanges();
  }

  onBulkEdit(employees: EmployeeWithShiftDetails[]) {
    const dialogRef = this.dialog.open(EditEmployeesDialogComponent, {
      data: {
        employees,
      },
      minWidth: 800,
    });

    dialogRef
      .afterClosed()
      .subscribe((updatedEmployeesData?: UpdatedEmployeeData[]) => {
        if (updatedEmployeesData) {
          this.updateAndRecalculateEmployeesWithShiftDetails(
            this.employeesWithShiftDetails,
            updatedEmployeesData
          );
        }
      });
  }

  updateAndRecalculateEmployeesWithShiftDetails(
    employeesWithShiftDetails: EmployeeWithShiftDetails[],
    updatedEmployeesData: UpdatedEmployeeData[]
  ) {
    this.employeesWithShiftDetails =
      this.dashboardService.getUpdatedEmployeesWithShiftDetails(
        employeesWithShiftDetails,
        updatedEmployeesData
      );
    this.generalEmployeesInfo = this.dashboardService.getGeneralEmployeesInfo(
      this.employeesWithShiftDetails
    );
    this.cdr.detectChanges();
  }
}
