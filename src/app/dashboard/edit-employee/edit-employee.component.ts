import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ins-edit-employee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
})
export class EditEmployeeComponent {
  @Input() form?: FormGroup;
}
