import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GeneralEmployeesInfo } from '../dashboard.model';

@Component({
  selector: 'ins-general-employees-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './general-employees-info.component.html',
  styleUrls: ['./general-employees-info.component.scss'],
})
export class GeneralEmployeesInfoComponent {
  @Input() generalInfoData?: GeneralEmployeesInfo;
}
