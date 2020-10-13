import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhrmacyRegistrationPage } from './phrmacy-registration';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PhrmacyRegistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(PhrmacyRegistrationPage),
    TranslateModule.forChild(),
  ],
})
export class PhrmacyRegistrationPageModule {}
