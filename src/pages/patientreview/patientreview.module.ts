import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientreviewPage } from './patientreview';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PatientreviewPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientreviewPage),
    TranslateModule.forChild(),
  ],
})
export class PatientreviewPageModule {}
