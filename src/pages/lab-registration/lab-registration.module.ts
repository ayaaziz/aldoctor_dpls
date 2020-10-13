import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LabRegistrationPage } from './lab-registration';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LabRegistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(LabRegistrationPage),
    TranslateModule.forChild(),
  ],
})
export class LabRegistrationPageModule {}
