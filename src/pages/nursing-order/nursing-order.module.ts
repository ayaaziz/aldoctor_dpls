import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NursingOrderPage } from './nursing-order';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    NursingOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(NursingOrderPage),
    TranslateModule.forChild(),
  ],
})
export class NursingOrderPageModule {}
