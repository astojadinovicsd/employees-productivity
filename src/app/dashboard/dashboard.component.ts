import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  allEmployees: Employee[] = [];
  allShifts: ShiftInfo[] = [];
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
    this.allEmployees = this.dashboardService.getEmployees();
    this.allShifts = this.dashboardService.getShifts();
    this.mapDashboardData();
  }

  mapDashboardData() {
    this.employeesWithShiftDetails =
      this.dashboardService.mapEmployeesAndShifts(
        this.allEmployees,
        this.allShifts
      );
    this.generalEmployeesInfo = this.dashboardService.getGeneralEmployeesInfo(
      this.employeesWithShiftDetails
    );
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
