import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { EmployeeWithShiftDetails } from '../dashboard.model';

@Component({
  selector: 'ins-employees-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
})
export class EmployeesListComponent {
  private _employees: EmployeeWithShiftDetails[] = [];
  @Input()
  public get employees(): EmployeeWithShiftDetails[] {
    return this._employees;
  }
  public set employees(value: EmployeeWithShiftDetails[]) {
    this._employees = value;
    this.selection = this.configureSelection();
  }

  @Output() bulkEdit: EventEmitter<EmployeeWithShiftDetails[]> =
    new EventEmitter();

  selection: SelectionModel<EmployeeWithShiftDetails>;
  displayedColumns: string[] = [
    'select',
    'name',
    'email',
    'totalClockedInTime',
    'totalAmountRegularHours',
    'totalAmountOvertimeHours',
  ];

  constructor() {
    this.selection = this.configureSelection();
  }

  configureSelection() {
    const initialSelection: EmployeeWithShiftDetails[] = [];
    const allowMultiSelect = true;
    return new SelectionModel<EmployeeWithShiftDetails>(
      allowMultiSelect,
      initialSelection
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.employees.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.employees.forEach(row => this.selection.select(row));
  }

  bulkEditButtonClicked() {
    this.bulkEdit.emit(this.selection.selected);
  }
}
