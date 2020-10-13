import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterConditionsPage } from './register-conditions';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterConditionsPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterConditionsPage),
    TranslateModule.forChild(),
  ],
})
export class RegisterConditionsPageModule {}
