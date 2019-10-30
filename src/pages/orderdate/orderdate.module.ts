import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderdatePage } from './orderdate';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OrderdatePage,
  ],
  imports: [
    IonicPageModule.forChild(OrderdatePage),
    TranslateModule.forChild(),
  ],
})
export class OrderdatePageModule {}
