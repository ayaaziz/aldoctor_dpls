import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UseConditionsPage } from './use-conditions';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UseConditionsPage,
  ],
  imports: [
    IonicPageModule.forChild(UseConditionsPage),
    TranslateModule.forChild(),
  ],
})
export class UseConditionsPageModule {}
