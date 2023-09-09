import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { DashboardService } from "./dashboard.service";

@NgModule({
    imports: [],
    declarations: [DashboardComponent],
    exports: [DashboardComponent],
    providers: [DashboardService],
  })
  export class DashboardModule {}