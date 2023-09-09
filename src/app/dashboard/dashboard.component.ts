import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Employee, ShiftInfo } from "./dashboard.model";
import { DashboardService } from "./dashboard.service";

@Component({
    selector: 'ins-dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
  })
  export class DashboardComponent implements OnInit {

    employees: Employee[] = []
    shifts: ShiftInfo[] = []

    constructor(private dashboardService: DashboardService) {}

    ngOnInit() {
      this.fetchData()
    }

    fetchData() {
      this.employees = this.dashboardService.getEmployees()
      this.shifts = this.dashboardService.getShifts()
    }

  }