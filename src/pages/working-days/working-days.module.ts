import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkingDaysPage } from './working-days';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WorkingDaysPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkingDaysPage),
    TranslateModule.forChild()
  ],
})
export class WorkingDaysPageModule {}
