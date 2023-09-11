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
  @Input() employees: EmployeeWithShiftDetails[] = [];

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
    const initialSelection: EmployeeWithShiftDetails[] = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<EmployeeWithShiftDetails>(
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
