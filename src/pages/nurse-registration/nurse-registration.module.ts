import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NurseRegistrationPage } from './nurse-registration';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    NurseRegistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(NurseRegistrationPage),
    TranslateModule.forChild(),
  ],
})
export class NurseRegistrationPageModule {}
