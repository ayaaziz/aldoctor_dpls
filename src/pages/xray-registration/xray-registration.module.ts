import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { XrayRegistrationPage } from './xray-registration';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    XrayRegistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(XrayRegistrationPage),
    TranslateModule.forChild(),
  ],
})
export class XrayRegistrationPageModule {}
