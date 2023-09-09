import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ins-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
