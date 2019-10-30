import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancialPage } from './financial';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FinancialPage,
  ],
  imports: [
    IonicPageModule.forChild(FinancialPage),
    TranslateModule.forChild(),
  ],
})
export class FinancialPageModule {}
