import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'ins-dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
  })
  export class DashboardComponent  {

  }