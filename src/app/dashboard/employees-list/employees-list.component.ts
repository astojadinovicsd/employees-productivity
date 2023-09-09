import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { EmployeeAllShifts } from '../dashboard.model';

@Component({
  selector: 'ins-employees-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
})
export class EmployeesListComponent {
  @Input() employees: EmployeeAllShifts[] = [];

  @Output() bulkEdit: EventEmitter<EmployeeAllShifts[]> = new EventEmitter();

  selection: SelectionModel<EmployeeAllShifts>;
  displayedColumns: string[] = [
    'select',
    'name',
    'email',
    'totalClockedInTime',
    'totalAmountRegularHours',
    'totalAmountOvertimeHours',
  ];

  constructor() {
    const initialSelection: EmployeeAllShifts[] = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<EmployeeAllShifts>(
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
