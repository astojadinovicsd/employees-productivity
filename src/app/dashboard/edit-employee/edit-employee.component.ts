import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { getDateWithoutTimezone } from 'src/app/core/utils';

@Component({
  selector: 'ins-edit-employee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
})
export class EditEmployeeComponent implements AfterViewInit {
  @Input()
  public get employeeForm(): FormGroup | undefined {
    return this._employeeForm;
  }
  public set employeeForm(value: FormGroup | undefined) {
    this._employeeForm = value;
    this.dataSource.data = (this.employeeForm?.get('shifts') as FormArray)
      ?.controls;
  }

  private _employeeForm?: FormGroup | undefined;
  displayedColumns: string[] = ['clockInDate', 'clockOutDate'];
  dataSource: MatTableDataSource<any>;
  selectedFilterDate: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    let dateStringFormat = '';
    if (date) {
      const datetimeStringFormat = getDateWithoutTimezone(date);
      dateStringFormat = datetimeStringFormat?.slice(0, 10);
    }

    this.dataSource.filter = dateStringFormat || '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getFilterPredicate() {
    return (row: FormGroup, filter: string) => {
      const clockInDate = row.value.clockInDate;
      const clockOutDate = row.value.clockOutDate;

      return clockInDate.includes(filter) || clockOutDate.includes(filter);
    };
  }

  clearSelectedDate() {
    this.selectedFilterDate = null;
    this.dataSource.filter = '';
  }
}
