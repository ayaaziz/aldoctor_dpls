import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LongTimeNursingOrderPage } from './long-time-nursing-order';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LongTimeNursingOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(LongTimeNursingOrderPage),
    TranslateModule.forChild(),
  ],
})
export class LongTimeNursingOrderPageModule {}
